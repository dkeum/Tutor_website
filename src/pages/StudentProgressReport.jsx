import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Download, GraduationCap, Crown } from 'lucide-react';
import axios from 'axios';
import LoggedInLayout from '../components/LoggedInLayout.jsx';
import { supabase } from '../db/supabaseclient';
import { setCredits } from '../features/auth/personDetails';

// =======================================================================
// Backend report_data shape (from generateStudentProgressReport):
// {
//   progress: { completion_pct, mastery, time_commitment_pct },
//   grade_breakdown: { strengths: [{section_id,name,grade}], developing: [...], needs_attention: [...] },
//   soft_skills: { persistence, independence, consistency, focus, error_checking }  // each 0-100 or null
//   hard_skills: { mastered: [string], needs_work: [string] },
//   recommendations: [string],
//   errors_to_fix: [string],
// }
// Several fields the old sample data had (trend %, before/after deltas,
// avg problem time, hint dependency) aren't computed by the backend yet —
// those sections are removed rather than faked. Add backend support first
// if you want them back.
// =======================================================================

function getMasteryStatus(score) {
    if (score === null || score === undefined) return { label: 'Not enough data', color: '#6b6475', bg: '#eeecf5' };
    if (score >= 85) return { label: 'Strong', color: '#0f6e56', bg: '#e4f3ee' };
    if (score >= 60) return { label: 'Developing', color: '#a5680f', bg: '#faf1de' };
    return { label: 'Needs Attention', color: '#a43e1c', bg: '#fbe9e3' };
}

function getCompletionBadge(percent) {
    if (percent >= 95) return { label: 'Completed', color: '#0f6e56', bg: '#e4f3ee' };
    if (percent >= 70) return { label: 'Almost there', color: '#a5680f', bg: '#faf1de' };
    return { label: 'Getting started', color: '#a43e1c', bg: '#fbe9e3' };
}

function getTimeCommitmentBadge(percent) {
    if (percent >= 95) return { label: 'Completed for this period', color: '#0f6e56', bg: '#e4f3ee' };
    if (percent >= 70) return { label: 'On track', color: '#a5680f', bg: '#faf1de' };
    return { label: 'Falling behind', color: '#a43e1c', bg: '#fbe9e3' };
}

function getReportPeriod(monthsBack = 1, referenceDate = new Date()) {
    const end = new Date(referenceDate);
    const start = new Date(referenceDate);
    start.setMonth(start.getMonth() - monthsBack);

    const startLabel = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endLabel = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return { start, end, label: `${startLabel} – ${endLabel}` };
}

const PERIOD_OPTIONS = [
    { months: 1, label: 'Past Month', premium: false },
    { months: 3, label: 'Past 3 Months', premium: true },
    { months: 12, label: 'Past Year', premium: true },
];

// Backend caps sections in strengths/needs_attention lists to short lists
// for the quick-glance view; the full table below shows everything.
const QUICK_LIST_CAP = 5;

// ---- Adapter: backend report_data -> view model this component renders --
function mapReportToViewModel(report) {
    const strengths = (report?.grade_breakdown?.strengths || [])
        .map((s) => ({ skill: s.name, score: s.grade }));
    const developing = (report?.grade_breakdown?.developing || [])
        .map((s) => ({ skill: s.name, score: s.grade }));
    const needsAttention = (report?.grade_breakdown?.needs_attention || [])
        .map((s) => ({ skill: s.name, score: s.grade }));

    const skillCategories = [...strengths, ...developing, ...needsAttention]
        .map((s) => ({ category: s.skill, score: s.score }));

    const learningBehaviors = [
        { skill: 'Persistence', score: report?.soft_skills?.persistence ?? null },
        { skill: 'Independence', score: report?.soft_skills?.independence ?? null },
        { skill: 'Consistency', score: report?.soft_skills?.consistency ?? null },
        { skill: 'Focus', score: report?.soft_skills?.focus ?? null },
        { skill: 'Error Checking', score: report?.soft_skills?.error_checking ?? null },
    ];

    return {
        mastery: report?.progress?.mastery ?? 0,
        completionRate: report?.progress?.completion_pct ?? 0,
        timeCommitmentPct: report?.progress?.time_commitment_pct ?? 0,
        strengths: strengths.slice(0, QUICK_LIST_CAP),
        needsAttention: needsAttention.slice(0, QUICK_LIST_CAP),
        skillCategories,
        learningBehaviors,
        hardSkillsMastered: report?.hard_skills?.mastered || [],
        hardSkillsNeedsWork: report?.hard_skills?.needs_work || [],
        recommendations: report?.recommendations || [],
        errorsToFix: report?.errors_to_fix || [],
    };
}

// ---- Small building blocks -------------------------------------------
function StatDial({ percent, caption, color = '#4441c4', track = '#e9e6f4', badge }) {
    const angle = Math.max(0, Math.min(100, percent)) * 3.6;
    return (
        <div className="dial-wrap">
            <div
                className="dial"
                style={{ background: `conic-gradient(${color} ${angle}deg, ${track} ${angle}deg)` }}
            >
                <div className="dial-inner">
                    <span className="dial-number" style={{ color }}>{percent}%</span>
                </div>
            </div>
            <span className="dial-label">{caption}</span>
            {badge && (
                <span className="status-badge" style={{ color: badge.color, background: badge.bg }}>
                    {badge.label}
                </span>
            )}
        </div>
    );
}

function SkillList({ title, items }) {
    if (items.length === 0) {
        return (
            <div className="skill-list">
                <p className="subheading">{title}</p>
                <p className="empty-note">No data for this period yet.</p>
            </div>
        );
    }
    return (
        <div className="skill-list">
            <p className="subheading">{title}</p>
            {items.map((item) => (
                <div key={item.skill} className="skill-row">
                    <span className="skill-name">{item.skill}</span>
                    <span className="skill-score">{item.score}%</span>
                </div>
            ))}
        </div>
    );
}

function SkillTable({ rows }) {
    if (rows.length === 0) {
        return <p className="empty-note">No graded sections in this period yet.</p>;
    }
    return (
        <div className="skill-table">
            <div className="skill-table-header">
                <span className="col-category">Section</span>
                <span className="col-score">Score</span>
                <span className="col-status">Status</span>
            </div>
            {rows.map((row) => {
                const status = getMasteryStatus(row.score);
                return (
                    <div key={row.category} className="skill-table-row">
                        <span className="col-category">{row.category}</span>
                        <div className="col-score bar-cell">
                            <div className="bar-track">
                                <div className="bar-fill" style={{ width: `${row.score}%`, background: status.color }} />
                            </div>
                            <span className="bar-number">{row.score}%</span>
                        </div>
                        <span className="col-status">
                            <span className="status-badge" style={{ color: status.color, background: status.bg }}>
                                {status.label}
                            </span>
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

// Handles null scores explicitly — a null soft-skill score means "not
// enough data this period," not zero, and must render as a distinct state.
function BehaviorList({ items }) {
    return (
        <div className="behavior-grid">
            {items.map((item) => {
                const status = getMasteryStatus(item.score);
                return (
                    <div key={item.skill} className="behavior-row">
                        <span className="behavior-name">{item.skill}</span>
                        <span className="status-badge" style={{ color: status.color, background: status.bg }}>
                            {status.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

function BulletList({ items, emptyText }) {
    if (!items || items.length === 0) {
        return <p className="empty-note">{emptyText}</p>;
    }
    return (
        <ul className="bullet-list">
            {items.map((text, i) => <li key={i}>{text}</li>)}
        </ul>
    );
}

function LoadingState() {
    return (
        <div className="report-loading">
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
        </div>
    );
}

export default function StudentReport() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Report endpoint doesn't return student name/grade — pull from
    // whatever slice already holds it post-login. CONFIRM this selector
    // path matches your actual store shape.
    const student = useSelector((state) => ({
        name: state?.auth?.name || 'Student',
        grade: state?.auth?.grade || '',
    }));

    const [periodMonths, setPeriodMonths] = useState(1);
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState(null);
    const [creditsExhausted, setCreditsExhausted] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const reportPeriod = useMemo(() => getReportPeriod(periodMonths), [periodMonths]);

    const fetchReport = useCallback(async (months) => {
        setLoading(true);
        setFetchError(null);
        try {
            const base =
                import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
                    ? "http://localhost:3000"
                    : "https://mathamagic-backend.vercel.app";

            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                navigate("/login");
                return;
            }

            const { data } = await axios.get(
                `${base}/generate-student-progress-report`,
                {
                    params: { months },
                    headers: { Authorization: `Bearer ${session.access_token}` },
                    withCredentials: true,
                }
            );

            setReport(data?.report || null);
            setCreditsExhausted(!!data?.creditsExhausted);

            const remainingCredits = data.creditsRemaining;
            if (remainingCredits !== undefined) {
                dispatch(setCredits({ ai_credits: Number(remainingCredits) }));
            }
        } catch (err) {
            console.error("Error fetching progress report:", err);
            setFetchError("Couldn't load your report. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [navigate, dispatch]);

    useEffect(() => {
        fetchReport(periodMonths);
    }, [periodMonths, fetchReport]);

    const vm = useMemo(() => mapReportToViewModel(report), [report]);

    const handleDownload = () => window.print();

    return (
        <div className="report-root">
            <style>{`
        .report-root {
          --ink: #191c1d;
          --muted: #6b6475;
          --primary: #4441c4;
          --card-bg: #f7f5fb;
          --hairline: #eadfea;
          font-family: 'Georgia', 'Iowan Old Style', serif;
          color: var(--ink);
          background: transparent;
          max-width: 880px;
          margin: 0 auto;
          padding: 8px;
          box-sizing: border-box;
        }
        .report-root * { box-sizing: border-box; }
        .toolbar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; flex-wrap: wrap; margin-bottom: 18px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }
        .period-picker { display: flex; gap: 6px; background: var(--card-bg); padding: 4px; border-radius: 10px; }
        .period-picker button {
          display: inline-flex; align-items: center; gap: 5px;
          border: none; background: transparent; padding: 7px 14px; border-radius: 7px;
          font-size: 13px; font-weight: 600; color: var(--muted); cursor: pointer; font-family: inherit;
        }
        .period-picker button.active { background: white; color: var(--primary); box-shadow: 0 1px 3px rgba(35, 25, 60, 0.12); }
        .period-picker button .premium-icon { color: #a5680f; }
        .download-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--primary); color: white; border: none;
          padding: 10px 18px; border-radius: 8px; font-size: 13.5px; font-weight: 600;
          font-family: inherit; cursor: pointer;
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .download-btn:hover { box-shadow: 0 4px 14px rgba(68, 65, 196, 0.35); transform: translateY(-1px); }
        .download-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .credits-banner {
          background: #fbe9e3; color: #a43e1c; font-size: 12.5px; font-weight: 600;
          padding: 8px 14px; border-radius: 8px; margin-bottom: 14px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }

        .sheet { background: white; border-radius: 14px; box-shadow: 0 2px 24px rgba(30, 20, 55, 0.08); padding: 40px 44px; }
        .header-row { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid var(--primary); padding-bottom: 14px; margin-bottom: 26px; }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .cap-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--card-bg); color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .student-name { font-size: 26px; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
        .report-label { font-size: 12.5px; color: var(--muted); margin: 3px 0 0; font-family: 'Helvetica Neue', Arial, sans-serif; }
        .report-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; font-family: 'Helvetica Neue', Arial, sans-serif; }
        .report-meta-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .report-meta-value { font-size: 13px; color: var(--ink); font-weight: 600; }

        .overall-block { display: flex; align-items: flex-start; justify-content: center; gap: 56px; margin-bottom: 32px; }
        .dial-wrap { display: flex; flex-direction: column; align-items: center; gap: 10px; font-family: 'Helvetica Neue', Arial, sans-serif; }
        .dial { width: 108px; height: 108px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .dial-inner { width: 84px; height: 84px; border-radius: 50%; background: white; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .dial-number { font-size: 22px; font-weight: 700; font-family: Georgia, serif; }
        .dial-label { font-size: 12.5px; font-weight: 700; color: var(--ink); font-family: 'Helvetica Neue', Arial, sans-serif; }

        .section { margin-bottom: 28px; font-family: 'Helvetica Neue', Arial, sans-serif; }
        .section-title { font-size: 14px; font-weight: 700; margin: 0 0 12px; padding-bottom: 6px; border-bottom: 1px solid var(--hairline); font-family: Georgia, serif; }
        .two-col { display: flex; gap: 32px; }
        .skill-list { flex: 1; }
        .subheading { font-size: 12.5px; font-weight: 700; margin: 0 0 8px; }
        .skill-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f1f0f4; font-size: 13px; }
        .skill-score { font-weight: 700; }
        .empty-note { font-size: 12.5px; color: var(--muted); font-style: italic; }

        .skill-table-header, .skill-table-row { display: flex; align-items: center; padding: 8px 10px; }
        .skill-table-header { background: var(--card-bg); border-radius: 6px; font-size: 10.5px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }
        .skill-table-row { border-bottom: 1px solid #f1f0f4; font-size: 13px; }
        .col-category { flex: 1.6; }
        .col-score { flex: 1.4; display: flex; align-items: center; gap: 8px; }
        .col-status { flex: 1.1; text-align: right; }
        .bar-track { flex: 1; height: 6px; background: #eeecf5; border-radius: 4px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 4px; }
        .bar-number { font-size: 12px; font-weight: 700; width: 32px; text-align: right; }
        .status-badge { font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 999px; white-space: nowrap; }

        .behavior-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 24px; }
        .behavior-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid #f1f0f4; font-size: 13px; }
        .behavior-name { color: var(--ink); }

        .bullet-list { margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.8; }

        .rec-row { margin-bottom: 12px; padding-left: 14px; border-left: 3px solid var(--primary); }
        .rec-priority { font-size: 10.5px; color: var(--primary); font-weight: 700; letter-spacing: 0.04em; }
        .rec-desc { font-size: 13px; color: #535158; margin: 2px 0 0; }

        .footer { font-size: 11px; color: #9c98a3; text-align: center; margin-top: 34px; padding-top: 16px; border-top: 1px solid #f1f0f4; font-family: 'Helvetica Neue', Arial, sans-serif; }

        .report-loading, .report-error {
          display: flex; align-items: center; justify-content: center; height: 300px; gap: 10px;
        }
        .report-error { color: var(--muted); font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; }
        .loading-dot { width: 12px; height: 12px; border-radius: 50%; background: #9b8aa8; display: inline-block; animation: report-bounce 1.4s infinite ease-in-out both; }
        .loading-dot:nth-child(1) { animation-delay: -0.32s; }
        .loading-dot:nth-child(2) { animation-delay: -0.16s; }
        .loading-dot:nth-child(3) { animation-delay: 0s; }
        @keyframes report-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

        @media print {
          .toolbar, .credits-banner { display: none !important; }
          .report-root { max-width: 100%; padding: 0; }
          .sheet { box-shadow: none; border-radius: 0; padding: 0; }
          @page { size: A4; margin: 18mm; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }

        @media (max-width: 640px) {
          .behavior-grid { grid-template-columns: 1fr; }
          .overall-block { flex-wrap: wrap; gap: 28px; }
        }
      `}</style>
            <LoggedInLayout>
                <div className="toolbar no-print">
                    <div className="period-picker">
                        {PERIOD_OPTIONS.map((p) => (
                            <button
                                key={p.months}
                                className={p.months === periodMonths ? 'active' : ''}
                                onClick={() => setPeriodMonths(p.months)}
                            >
                                {p.premium && <Crown size={13} className="premium-icon" />}
                                {p.label}
                            </button>
                        ))}
                    </div>
                    <button className="download-btn" onClick={handleDownload} disabled={loading || !report}>
                        <Download size={15} />
                        Download PDF Report
                    </button>
                </div>

                {loading && <LoadingState />}

                {!loading && fetchError && (
                    <div className="report-error">{fetchError}</div>
                )}

                {!loading && !fetchError && report && (
                    <div className="sheet">
                        {creditsExhausted && (
                            <div className="credits-banner">
                                Recommendations weren't generated this run — out of AI credits.
                            </div>
                        )}

                        <div className="header-row">
                            <div className="header-left">
                                <div className="cap-icon"><GraduationCap size={20} /></div>
                                <div>
                                    <p className="student-name">{student.name}</p>
                                    <p className="report-label">Math Performance Report{student.grade ? ` · ${student.grade}` : ''}</p>
                                </div>
                            </div>
                            <div className="report-meta">
                                <span className="report-meta-label">Report Period</span>
                                <span className="report-meta-value">{reportPeriod.label}</span>
                            </div>
                        </div>

                        <div className="overall-block">
                            <StatDial percent={vm.mastery} caption="Mastery" color="#4441c4" />
                            <StatDial percent={vm.completionRate} caption="Completion" color="#0f6e56" badge={getCompletionBadge(vm.completionRate)} />
                            <StatDial percent={vm.timeCommitmentPct} caption="Time Commitment" color="#a5680f" badge={getTimeCommitmentBadge(vm.timeCommitmentPct)} />
                        </div>

                        <div className="section">
                            <div className="two-col">
                                <SkillList title="Strengths" items={vm.strengths} />
                                <SkillList title="Needs Attention" items={vm.needsAttention} />
                            </div>
                        </div>

                        <div className="section">
                            <p className="section-title">Section Performance</p>
                            <SkillTable rows={vm.skillCategories} />
                        </div>

                        <div className="section">
                            <p className="section-title">Learning Behaviors</p>
                            <BehaviorList items={vm.learningBehaviors} />
                        </div>

                        <div className="section">
                            <div className="two-col">
                                <div className="skill-list">
                                    <p className="subheading">Skills Mastered</p>
                                    <BulletList items={vm.hardSkillsMastered} emptyText="No skills recorded yet." />
                                </div>
                                <div className="skill-list">
                                    <p className="subheading">Skills Needing Work</p>
                                    <BulletList items={vm.hardSkillsNeedsWork} emptyText="No skills recorded yet." />
                                </div>
                            </div>
                        </div>

                        <div className="section">
                            <p className="section-title">Errors to Fix</p>
                            <BulletList
                                items={vm.errorsToFix}
                                emptyText={creditsExhausted ? "Not generated this run — out of AI credits." : "No recurring errors flagged this period."}
                            />
                        </div>

                        <div className="section">
                            <p className="section-title">Recommended Next Steps</p>
                            {vm.recommendations.length === 0 ? (
                                <p className="empty-note">
                                    {creditsExhausted ? "Not generated this run — out of AI credits." : "No recommendations for this period."}
                                </p>
                            ) : (
                                vm.recommendations.map((rec, i) => (
                                    <div key={i} className="rec-row">
                                        <p className="rec-priority">PRIORITY {i + 1}</p>
                                        <p className="rec-desc">{rec}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <p className="footer">Generated by Mathamagic · mathmagick.com</p>
                    </div>
                )}
            </LoggedInLayout>
        </div>
    );
}
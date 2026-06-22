import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import NavbarLoggedIn from "../components/NavbarLoggedIn";
import Sidebar from "../components/Sidebar";

const BASE =
  import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
    ? "http://localhost:3000"
    : "https://mathamagic-backend.vercel.app";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const TOKEN = {
  primary: "#4441c4",
  onPrimary: "#ffffff",
  tertiary: "#632ecd",
  surface: "#f7f9fb",
  surfaceContainerLow: "#f2f4f6",
  surfaceContainer: "#eceef0",
  surfaceContainerHighest: "#e0e3e5",
  onSurface: "#191c1e",
  onSurfaceVariant: "#464554",
  outlineVariant: "#c7c4d6",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Work+Sans:wght@400;500&family=JetBrains+Mono:wght@500&display=swap');
  .fe-root { font-family: 'Work Sans', sans-serif; color: ${TOKEN.onSurface}; min-height: 100vh; }
  .fe-headline { font-family: 'Hanken Grotesk', sans-serif; }
  .fe-mono { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.05em; font-weight: 500; }
  .fe-progress-track { background: ${TOKEN.surfaceContainerHighest}; border-radius: 9999px; height: 8px; overflow: hidden; }
  .fe-progress-fill { background: ${TOKEN.primary}; border-radius: 9999px; height: 100%; transition: width 0.5s ease; }
  .fe-btn-primary {
    background: ${TOKEN.primary}; color: ${TOKEN.onPrimary};
    font-family: 'Hanken Grotesk', sans-serif; font-weight: 700; font-size: 14px;
    padding: 12px 28px; border-radius: 12px; border: none; cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    transition: opacity 0.15s, transform 0.15s;
  }
  .fe-btn-primary:hover { opacity: 0.92; transform: scale(1.02); }
  .fe-btn-primary:active { transform: scale(0.97); }
  .fe-btn-skip {
    background: transparent; color: ${TOKEN.onSurfaceVariant};
    font-family: 'Hanken Grotesk', sans-serif; font-weight: 600; font-size: 13px;
    padding: 8px 16px; border-radius: 8px; border: 1px solid ${TOKEN.outlineVariant};
    cursor: pointer; transition: background 0.15s, color 0.15s;
    display: flex; align-items: center; gap: 6px;
  }
  .fe-btn-skip:hover { background: rgba(0,0,0,0.04); color: ${TOKEN.onSurface}; }
  .skipped-badge {
    display: inline-flex; align-items: center; gap: 4px;
    background: rgba(151,72,0,0.1); color: #974800;
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500;
    padding: 3px 8px; border-radius: 9999px; letter-spacing: 0.04em;
  }
  .verifying-badge {
    display: inline-flex; align-items: center; gap: 4px;
    background: rgba(68,65,196,0.08); color: ${TOKEN.primary};
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500;
    padding: 3px 8px; border-radius: 9999px; letter-spacing: 0.04em;
  }
`;

// ─── Puter verification (fire-and-forget, updates answers map quietly) ─────────
async function verifyAnswerWithPuter(question, answerGiven, correctAnswer) {
  try {
    const prompt = `You are a math answer evaluator.
Question: "${question}"
Correct answer: "${correctAnswer}"
Student answer: "${answerGiven}"

Is the student's answer mathematically equivalent to the correct answer?
Reply with ONLY a JSON object: {"is_correct": true} or {"is_correct": false}`;

    const response = await window.puter.ai.chat(prompt, { json_mode: true });
    const raw = response?.message?.content ?? response;
    const parsed = typeof raw === "string" ? JSON.parse(raw.trim()) : raw;
    return typeof parsed?.is_correct === "boolean" ? parsed.is_correct : null;
  } catch {
    return null; // fall back to client-side string match
  }
}

// ─── Timer ────────────────────────────────────────────────────────────────────
function GlobalTimer({ totalSeconds }) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <div style={{ background: TOKEN.surfaceContainerLow, border: `1px solid ${TOKEN.outlineVariant}`, borderRadius: 12, padding: "10px 18px", display: "flex", alignItems: "center", gap: 12 }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={TOKEN.onSurfaceVariant} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="fe-mono" style={{ color: TOKEN.onSurfaceVariant, textTransform: "uppercase" }}>Elapsed</span>
      <span className="fe-headline" style={{ fontSize: 18, fontWeight: 700, color: TOKEN.onSurface, letterSpacing: "0.04em" }}>
        {h > 0 ? `${pad(h)}:` : ""}{pad(m)}:{pad(s)}
      </span>
    </div>
  );
}

function QuestionsRemaining({ remaining, total, skippedCount }) {
  return (
    <div style={{ background: TOKEN.surfaceContainerLow, border: `1px solid ${TOKEN.outlineVariant}`, borderRadius: 12, padding: "10px 18px", display: "flex", alignItems: "center", gap: 12 }}>
      <span className="fe-mono" style={{ color: TOKEN.onSurfaceVariant, textTransform: "uppercase" }}>Remaining</span>
      <span className="fe-headline" style={{ fontSize: 18, fontWeight: 700, color: TOKEN.primary }}>
        {remaining}<span style={{ fontSize: 13, fontWeight: 500, color: TOKEN.onSurfaceVariant }}>/{total}</span>
      </span>
      {skippedCount > 0 && <span className="skipped-badge">{skippedCount} skipped</span>}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const FinalExamPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const questions = location.state?.questions; // now includes section_id, topic_id, correct_answer


  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});       // { [idx]: AnswerRecord }
  const [draftAnswer, setDraftAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [skippedIndices, setSkippedIndices] = useState(new Set());
  // Tracks which question indices are currently being Puter-verified
  const [verifying, setVerifying] = useState(new Set());

  const timerRef = useRef(null);
  // Per-question elapsed seconds (resets when moving between questions)
  const questionSecondsRef = useRef(0);
  const questionTimerRef = useRef(null);
  const startedAtRef = useRef(new Date().toISOString());

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(questionTimerRef.current);
    timerRef.current = null;
    questionTimerRef.current = null;
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => setTotalSeconds((p) => p + 1), 1000);
    questionTimerRef.current = setInterval(() => { questionSecondsRef.current += 1; }, 1000);
  }, [stopTimer]);

  const resetQuestionTimer = () => {
    questionSecondsRef.current = 0;
  };

  useEffect(() => {
    if (!questions || questions.length === 0) {
      navigate("/final-exam/prep");
    } else {
      setLoading(false);
      startTimer();
    }
    return () => stopTimer();
  }, []);

  useEffect(() => {
    setDraftAnswer(answers[currentIndex]?.answer_given ?? "");
    resetQuestionTimer();
  }, [currentIndex]);

  if (loading) {
    return (
      <div className="fe-root" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{styles}</style>
        <span style={{ color: TOKEN.onSurfaceVariant, fontSize: 15 }}>Loading exam…</span>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;
  const remaining = totalQ - answeredCount;

  const findNextUnanswered = (fromIndex) => {
    for (let i = fromIndex + 1; i < totalQ; i++) { if (!answers[i]) return i; }
    for (let i = 0; i < fromIndex; i++) { if (!answers[i]) return i; }
    return null;
  };

  const handleSkip = () => {
    setSkippedIndices((prev) => new Set([...prev, currentIndex]));
    const next = findNextUnanswered(currentIndex);
    if (next !== null) setCurrentIndex(next);
  };

  const handleNext = async () => {
    if (!draftAnswer.trim()) return;

    const timeSpent = questionSecondsRef.current;
    const correctAnswer = currentQ.correct_answer ?? "";

    // Optimistic client-side check first (instant feedback to state)
    const clientIsCorrect = draftAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

    const record = {
      question_id: currentQ.id,
      section_id: currentQ.section_id ?? null,
      topic_id: currentQ.topic_id ?? null,
      answer_given: draftAnswer.trim(),
      is_correct: clientIsCorrect,   // will be overwritten by Puter if it succeeds
      time_spent_seconds: timeSpent,
      correct_answer: correctAnswer, // kept locally for Puter context, stripped before submit
    };

    const updatedAnswers = { ...answers, [currentIndex]: record };
    setAnswers(updatedAnswers);
    setDraftAnswer("");
    resetQuestionTimer();

    setSkippedIndices((prev) => {
      const next = new Set(prev); next.delete(currentIndex); return next;
    });

    // Fire Puter verification quietly in the background
    const idxToVerify = currentIndex;
    setVerifying((prev) => new Set([...prev, idxToVerify]));
    verifyAnswerWithPuter(currentQ.question, draftAnswer.trim(), correctAnswer).then((puterResult) => {
      if (puterResult !== null) {
        // Patch just the is_correct field — don't overwrite anything else
        setAnswers((prev) => ({
          ...prev,
          [idxToVerify]: { ...prev[idxToVerify], is_correct: puterResult },
        }));
      }
      setVerifying((prev) => { const next = new Set(prev); next.delete(idxToVerify); return next; });
    });

    const newAnsweredCount = Object.keys(updatedAnswers).length;
    if (newAnsweredCount === totalQ) {
      // Wait a beat so in-flight Puter calls can land before we submit
      setTimeout(() => handleSubmit(updatedAnswers), 800);
    } else {
      const next = findNextUnanswered(currentIndex);
      if (next !== null) setCurrentIndex(next);
    }
  };

  const handleSubmit = async (finalAnswers) => {
    stopTimer();
    setSubmitting(true);
  
    const payload = Object.values(finalAnswers).map(({ correct_answer, ...rest }) => rest);
  
    try {
      const { data } = await axios.post(
        `${BASE}/final-exam/submit`,
        {
          // studentId removed — backend derives it from the auth cookie
          answers: payload,
          total_seconds: totalSeconds,
          started_at: startedAtRef.current,
        },
        { withCredentials: true }   // ← this is what sends the cookie
      );
      navigate("/final-exam-prep", { state: { result: data, answers: payload, questions } });
    } catch (err) {
      console.error("Submission failed", err);
      setSubmitting(false);
      startTimer();
    }
  };

  const progressPct = Math.round((answeredCount / totalQ) * 100);
  const isAnswered = Boolean(answers[currentIndex]);
  const allAnswered = answeredCount === totalQ;
  const isLastUnanswered = findNextUnanswered(currentIndex) === null && !isAnswered;
  const isVerifyingCurrent = verifying.has(currentIndex);

  const btnLabel = allAnswered ? "Submit Exam"
    : isAnswered ? "Next Question"
    : isLastUnanswered ? "Submit Exam"
    : "Next Question";

  return (
    <div className="fe-root">
      <style>{styles}</style>
      <NavbarLoggedIn />
      <Sidebar />

      <main style={{ maxWidth: 760, margin: "32px auto", padding: "0 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 className="fe-headline" style={{ fontSize: 22, fontWeight: 700, margin: 0, color: TOKEN.onSurface }}>Final Exam</h2>
            <p style={{ fontSize: 13, color: TOKEN.onSurfaceVariant, margin: "2px 0 0" }}>Answer all questions to submit</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <GlobalTimer totalSeconds={totalSeconds} />
            <QuestionsRemaining remaining={remaining} total={totalQ} skippedCount={skippedIndices.size} />
          </div>
        </div>

        {/* Progress */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span className="fe-mono" style={{ color: TOKEN.primary, textTransform: "uppercase" }}>Progress</span>
            <span style={{ fontSize: 13, color: TOKEN.onSurfaceVariant, fontWeight: 500 }}>{answeredCount} of {totalQ} answered</span>
          </div>
          <div className="fe-progress-track">
            <div className="fe-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div style={{ background: "#fff", borderRadius: 20, border: `1px solid ${TOKEN.outlineVariant}`, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 4, height: "100%", background: TOKEN.primary, borderRadius: "20px 0 0 20px" }} />

          <div style={{ padding: "24px 24px 24px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span className="fe-mono" style={{ color: TOKEN.primary, textTransform: "uppercase" }}>
                Question {currentIndex + 1}
              </span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {isVerifyingCurrent && <span className="verifying-badge">⟳ verifying</span>}
                {isAnswered && !isVerifyingCurrent && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(22,163,74,0.1)", color: "#16a34a", fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, padding: "3px 8px", borderRadius: 9999, letterSpacing: "0.04em" }}>
                    ✓ answered
                  </span>
                )}
                {skippedIndices.has(currentIndex) && !isAnswered && <span className="skipped-badge">skipped</span>}
              </div>
            </div>

            <p style={{ fontSize: 16, lineHeight: 1.65, color: TOKEN.onSurface, fontWeight: 500, margin: "0 0 20px" }}>
              {currentQ.question}
            </p>

            <textarea
              value={draftAnswer}
              onChange={(e) => setDraftAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) handleNext(); }}
              placeholder="Type your answer here…"
              rows={4}
              style={{ width: "100%", padding: "12px 14px", border: `1px solid ${TOKEN.outlineVariant}`, borderRadius: 12, fontSize: 15, fontFamily: "'Work Sans', sans-serif", lineHeight: 1.6, resize: "vertical", outline: "none", boxSizing: "border-box", color: TOKEN.onSurface, background: TOKEN.surfaceContainerLow }}
              onFocus={(e) => (e.target.style.borderColor = TOKEN.primary)}
              onBlur={(e) => (e.target.style.borderColor = TOKEN.outlineVariant)}
            />
          </div>

          {/* Action bar */}
          <div style={{ padding: "14px 24px 18px 32px", borderTop: `1px solid ${TOKEN.outlineVariant}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: TOKEN.surfaceContainerLow }}>
            <div>
              {!isLastUnanswered && !allAnswered && (
                <button className="fe-btn-skip" onClick={handleSkip}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="5 12 19 12" /><polyline points="13 6 19 12 13 18" /><line x1="5" y1="5" x2="5" y2="19" />
                  </svg>
                  Skip
                </button>
              )}
            </div>

            <button
              className="fe-btn-primary"
              onClick={handleNext}
              // onClick={handleSubmit}
              disabled={submitting || (!draftAnswer.trim() && !isAnswered)}
              style={{ opacity: submitting || (!draftAnswer.trim() && !isAnswered) ? 0.5 : 1, cursor: submitting || (!draftAnswer.trim() && !isAnswered) ? "not-allowed" : "pointer" }}
            >
              {submitting ? "Submitting…" : (
                <>
                  {btnLabel}
                  {!allAnswered && !isLastUnanswered && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  )}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dot nav */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          {questions.map((_, i) => {
            const answered = Boolean(answers[i]);
            const skipped = skippedIndices.has(i) && !answered;
            const active = i === currentIndex;
            const isVer = verifying.has(i);
            return (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                title={`Question ${i + 1}${answered ? " (answered)" : skipped ? " (skipped)" : ""}`}
                style={{
                  width: 28, height: 28, borderRadius: 8,
                  border: active ? `2px solid ${TOKEN.primary}` : answered ? "1.5px solid #16a34a" : skipped ? "1.5px solid #974800" : `1.5px solid ${TOKEN.outlineVariant}`,
                  background: active ? TOKEN.primary : answered ? "rgba(22,163,74,0.1)" : skipped ? "rgba(151,72,0,0.08)" : TOKEN.surfaceContainerLow,
                  color: active ? "#fff" : answered ? "#16a34a" : skipped ? "#974800" : TOKEN.onSurfaceVariant,
                  fontSize: 11, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace", transition: "all 0.15s", flexShrink: 0,
                  outline: isVer ? `2px solid ${TOKEN.primary}` : "none",
                }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default FinalExamPage;
import React, { useState, useEffect, useRef, useCallback } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import questionsTen from "../assets/questionsTen.json"




// Maps the "image" filename in questions.json to the imported module, so
// questions.json can stay plain data with no bundler-specific syntax in it.
const IMAGE_MAP = {
    'q_electrician_graph.png': './q_electrician_graph.png',
    'q_graph_a.png': './q_graph_a.png',
    'q_graph_b.png': './q_graph_b.png',
    'q_graph_c.png': "./q_graph_c.png",
}

const ASSESSMENT_DURATION_SECONDS = 60 * 60 // 1 hour

function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
}

const colors = {
    ink: '#1C1B29',
    paper: '#FBFAF7',
    card: '#FFFFFF',
    line: '#E4E1D8',
    indigo: '#3B3270',
    indigoDeep: '#241E4E',
    gold: '#C98A3E',
    correct: '#2F7A4F',
    incorrect: '#B23A3A',
    muted: '#6F6B5E',
}

export default function AssessmentTen() {
    const [index, setIndex] = useState(0)
    const [answers, setAnswers] = useState({})
    const [timeLeft, setTimeLeft] = useState(ASSESSMENT_DURATION_SECONDS)
    const [submitted, setSubmitted] = useState(false)
    const timerRef = useRef(null)

    const total = questionsTen.length
    const current = questionsTen[index]
    const answeredCount = Object.keys(answers).length

    const handleSubmit = useCallback(() => {
        setSubmitted(true)
    }, [])

    // Countdown timer
    useEffect(() => {
        if (submitted) return
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current)
                    handleSubmit()
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(timerRef.current)
    }, [submitted, handleSubmit])

    const selectAnswer = (optionId) => {
        setAnswers((prev) => ({ ...prev, [current.id]: optionId }))
    }

    const goNext = () => setIndex((i) => Math.min(i + 1, total - 1))
    const goPrev = () => setIndex((i) => Math.max(i - 1, 0))
    const goTo = (i) => setIndex(i)

    const score = submitted
        ? questionsTen.reduce(
            (acc, q) => acc + (answers[q.id] === q.correctOptionId ? 1 : 0),
            0
        )
        : 0

    const urgent = timeLeft <= 300 // last 5 minutes

    if (submitted) {
        return (
            <ResultsScreen
                score={score}
                total={total}
                questions={questionsTen}
                answers={answers}
            />
        )
    }

    return (
        <div style={styles.page}>
            {/* Timer bar */}
            <div style={styles.timerBar(urgent)}>
                <div style={styles.timerBarInner}>
                    <span style={styles.brand}>Mathmagick &mdash; Math 10 Assessment</span>
                    <span style={styles.timerText(urgent)}>
                        {urgent ? 'Time left: ' : 'Time remaining: '}
                        {formatTime(timeLeft)}
                    </span>
                </div>
                <div style={styles.progressTrack}>
                    <div
                        style={{
                            ...styles.progressFill,
                            width: `${(timeLeft / ASSESSMENT_DURATION_SECONDS) * 100}%`,
                            background: urgent ? colors.incorrect : colors.gold,
                        }}
                    />
                </div>
            </div>

            <main style={styles.main}>
                <div style={styles.questionMeta}>
                    <span style={styles.sectionLabel}>{current.section}</span>
                    <span style={styles.counter}>
                        Question {index + 1} of {total}
                    </span>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.prompt}><MathText text={current.prompt} /></h2>

                    {current.image && (
                        <div style={styles.imageWrap}>
                            <img
                                src={IMAGE_MAP[current.image]}
                                alt={`Diagram for question ${index + 1}`}
                                style={styles.image}
                            />
                        </div>
                    )}

                    <div style={styles.options}>
                        {current.options.map((opt) => {
                            const selected = answers[current.id] === opt.id
                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => selectAnswer(opt.id)}
                                    style={styles.option(selected)}
                                    type="button"
                                >
                                    <span style={styles.optionLetter(selected)}>
                                        {opt.id.toUpperCase()}
                                    </span>
                                    <span style={styles.optionText}><MathText text={opt.text} /></span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div style={styles.navRow}>
                    <button
                        onClick={goPrev}
                        disabled={index === 0}
                        style={styles.navButton(index === 0)}
                        type="button"
                    >
                        &larr; Previous
                    </button>

                    {index < total - 1 ? (
                        <button onClick={goNext} style={styles.navButtonPrimary} type="button">
                            Next &rarr;
                        </button>
                    ) : (
                        <button onClick={handleSubmit} style={styles.submitButton} type="button">
                            Submit assessment
                        </button>
                    )}
                </div>

                <div style={styles.dotsRow}>
                    {questionsTen.map((q, i) => (
                        <button
                            key={q.id}
                            onClick={() => goTo(i)}
                            title={`Question ${i + 1}`}
                            style={styles.dot(i === index, !!answers[q.id])}
                            type="button"
                        />
                    ))}
                </div>

                <div style={styles.footerRow}>
                    <span>{answeredCount} of {total} answered</span>
                    <button onClick={handleSubmit} style={styles.submitLink} type="button">
                        Submit now
                    </button>
                </div>
            </main>
        </div>
    )
}

function ResultsScreen({ score, total, questions, answers }) {
    const pct = Math.round((score / total) * 100)

    const sectionStats = {}
    questions.forEach((q) => {
        if (!sectionStats[q.section]) {
            sectionStats[q.section] = { correct: 0, total: 0 }
        }
        sectionStats[q.section].total += 1
        if (answers[q.id] === q.correctOptionId) {
            sectionStats[q.section].correct += 1
        }
    })

    return (
        <div style={styles.page}>
            <main style={styles.main}>
                <div style={styles.resultsCard}>
                    <span style={styles.brand}>Mathmagick &mdash; Assessment complete</span>
                    <h1 style={styles.resultsScore}>
                        {score} / {total}
                    </h1>
                    <p style={styles.resultsPct}>{pct}% correct</p>

                    <div style={styles.sectionBreakdown}>
                        {Object.entries(sectionStats).map(([section, stat]) => (
                            <div key={section} style={styles.sectionRow}>
                                <span style={styles.sectionRowLabel}>{section}</span>
                                <span style={styles.sectionRowScore}>
                                    {stat.correct}/{stat.total}
                                </span>
                            </div>
                        ))}
                    </div>

                    <p style={styles.resultsNote}>
                        This result gives us a clear starting point for where to focus your
                        foundation-building plan.
                    </p>
                </div>
            </main>
        </div>
    )
}

const styles = {
    page: {
        minHeight: '100vh',
        background: colors.paper,
        color: colors.ink,
        fontFamily:
            '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
    },
    timerBar: (urgent) => ({
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: colors.indigoDeep,
        color: '#F4F2EA',
        padding: '14px 20px 0',
    }),
    timerBarInner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        maxWidth: 720,
        margin: '0 auto',
        paddingBottom: 10,
        flexWrap: 'wrap',
        gap: 8,
    },
    brand: {
        fontSize: 14,
        letterSpacing: 0.2,
        opacity: 0.85,
    },
    timerText: (urgent) => ({
        fontSize: 17,
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        color: urgent ? '#FF9B8A' : '#F4F2EA',
    }),
    progressTrack: {
        height: 3,
        background: 'rgba(255,255,255,0.15)',
        maxWidth: 720,
        margin: '0 auto',
    },
    progressFill: {
        height: '100%',
        transition: 'width 1s linear',
    },
    main: {
        maxWidth: 720,
        margin: '0 auto',
        padding: '28px 20px 60px',
    },
    questionMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    sectionLabel: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: 12,
        letterSpacing: 0.4,
        color: colors.gold,
        fontWeight: 600,
    },
    counter: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: 13,
        color: colors.muted,
    },
    card: {
        background: colors.card,
        border: `1px solid ${colors.line}`,
        borderRadius: 4,
        padding: '32px 28px',
    },
    prompt: {
        fontSize: 21,
        lineHeight: 1.45,
        fontWeight: 500,
        margin: '0 0 20px',
    },
    imageWrap: {
        display: 'flex',
        justifyContent: 'center',
        margin: '0 0 24px',
        background: '#FDFCF9',
        border: `1px solid ${colors.line}`,
        borderRadius: 4,
        padding: 16,
    },
    image: {
        maxWidth: '100%',
        height: 'auto',
    },
    options: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
    option: (selected) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        textAlign: 'left',
        padding: '14px 16px',
        borderRadius: 4,
        border: `1.5px solid ${selected ? colors.indigo : colors.line}`,
        background: selected ? '#EFEBFA' : colors.card,
        cursor: 'pointer',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: 15.5,
    }),
    optionLetter: (selected) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: '50%',
        fontSize: 13,
        fontWeight: 700,
        flexShrink: 0,
        background: selected ? colors.indigo : '#F1EFE7',
        color: selected ? '#fff' : colors.muted,
    }),
    optionText: {
        color: colors.ink,
    },
    navRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 22,
        gap: 12,
    },
    navButton: (disabled) => ({
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: '11px 20px',
        borderRadius: 4,
        border: `1px solid ${colors.line}`,
        background: colors.card,
        color: disabled ? '#B8B4A6' : colors.ink,
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 14,
    }),
    navButtonPrimary: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: '11px 22px',
        borderRadius: 4,
        border: 'none',
        background: colors.indigo,
        color: '#fff',
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 600,
    },
    submitButton: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: '11px 22px',
        borderRadius: 4,
        border: 'none',
        background: colors.gold,
        color: '#2B1D0E',
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 700,
    },
    dotsRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 26,
    },
    dot: (active, answered) => ({
        width: 9,
        height: 9,
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        background: active ? colors.indigo : answered ? colors.gold : colors.line,
    }),
    footerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 18,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: 13,
        color: colors.muted,
    },
    submitLink: {
        background: 'none',
        border: 'none',
        color: colors.indigo,
        cursor: 'pointer',
        fontSize: 13,
        textDecoration: 'underline',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    resultsCard: {
        background: colors.card,
        border: `1px solid ${colors.line}`,
        borderRadius: 4,
        padding: '40px 32px',
        textAlign: 'center',
    },
    resultsScore: {
        fontSize: 52,
        margin: '18px 0 0',
    },
    resultsPct: {
        color: colors.muted,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        marginTop: 4,
    },
    sectionBreakdown: {
        marginTop: 28,
        textAlign: 'left',
        borderTop: `1px solid ${colors.line}`,
        paddingTop: 18,
    },
    sectionRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '7px 0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: 14.5,
    },
    sectionRowLabel: {
        color: colors.ink,
    },
    sectionRowScore: {
        color: colors.muted,
        fontVariantNumeric: 'tabular-nums',
    },
    resultsNote: {
        marginTop: 26,
        color: colors.muted,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: 14,
        lineHeight: 1.6,
    },
}



const InlineMath = ({ math }) => {
    const html = katex.renderToString(math, { throwOnError: false });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

const BlockMath = ({ math }) => {
    const html = katex.renderToString(math, {
        throwOnError: false,
        displayMode: true,
    });
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const ENGLISH_CONNECTOR_WORDS = /\b(to|per|for|of|and|or|is|are|the|an|in|on|at|with|from|by|as|you|your|will|would|need)\b/i;

const looksLikeMath = (content) => {
    const trimmed = content.trim();
    if (!trimmed) return false;

    if (/\\[a-zA-Z]+/.test(trimmed)) return true;

    const MATH_OPERATOR_PATTERN = /[a-zA-Z0-9]\s*[\^*/]\s*[a-zA-Z0-9]/;
    if (MATH_OPERATOR_PATTERN.test(trimmed) && trimmed.length <= 40) {
        if (/\.\s/.test(trimmed)) return false;
        if (/[a-zA-Z]{4,}\s+[a-zA-Z]{4,}\s+[a-zA-Z]{4,}/.test(trimmed)) return false;
        return true;
    }

    if (ENGLISH_CONNECTOR_WORDS.test(trimmed)) return false;
    if (/\.\s/.test(trimmed)) return false;
    if (/[a-zA-Z]{4,}\s+[a-zA-Z]{4,}\s+[a-zA-Z]{4,}/.test(trimmed)) return false;
    if (trimmed.length > 40) return false;
    return true;
};

const parseMathParts = (text) => {
    if (!text) return [];

    const parts = [];
    const regex = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)|\$\$([\s\S]*?)\$\$|\$((?:\\[\s\S]|[^$\\])+?)\$/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
        }

        const isSingleDollar = match[4] !== undefined;
        const isBlock = match[0].startsWith("\\[") || match[0].startsWith("$$");
        let content = match[1] ?? match[2] ?? match[3] ?? match[4];

        if (isSingleDollar && !looksLikeMath(content)) {
            parts.push({ type: "text", content: match[0] });
            lastIndex = match.index + match[0].length;
            continue;
        }

        content = content.replace(
            /([a-zA-Z0-9_^{}()\.\+\-]+)\s*\/\s*([a-zA-Z0-9_^{}()\.\+\-]+)/g,
            '\\frac{$1}{$2}'
        );

        parts.push({ type: "math", content, block: isBlock });
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        parts.push({ type: "text", content: text.slice(lastIndex) });
    }

    const finalParts = [];
    parts.forEach((part) => {
        if (part.type === "math") {
            finalParts.push(part);
            return;
        }

        let subText = part.content;
        const inlineMathRegex = /([a-zA-Z0-9_]+)\^([a-zA-Z0-9_]+)|([a-zA-Z0-9_]+)\s*\/\s*([a-zA-Z0-9_]+)/g;
        let subLastIndex = 0;
        let subMatch;

        while ((subMatch = inlineMathRegex.exec(subText)) !== null) {
            if (subMatch.index > subLastIndex) {
                finalParts.push({ type: "text", content: subText.slice(subLastIndex, subMatch.index) });
            }

            if (subMatch[1] && subMatch[2]) {
                finalParts.push({ type: "math", content: `${subMatch[1]}^${subMatch[2]}`, block: false });
            } else if (subMatch[3] && subMatch[4]) {
                finalParts.push({ type: "math", content: `\\frac{${subMatch[3]}}{${subMatch[4]}}`, block: false });
            }

            subLastIndex = subMatch.index + subMatch[0].length;
        }

        if (subLastIndex < subText.length) {
            finalParts.push({ type: "text", content: subText.slice(subLastIndex) });
        }
    });

    return finalParts;
};

const MathText = ({ text }) => (
    <span>
        {parseMathParts(text).map((part, i) =>
            part.type === "text" ? (
                <span key={i}>{part.content}</span>
            ) : part.block ? (
                <BlockMath key={i} math={part.content} />
            ) : (
                <InlineMath key={i} math={part.content} />
            )
        )}
    </span>
);

// NEW — brand purple, matches TOKEN.primary in SolveProblems.jsx.
// Hardcoded here rather than imported to keep this component standalone;
// pass an `accentColor` prop instead if you want it to track TOKEN centrally.
const ACCENT = "#4441c4";

// options: the jsonb array from `question.options`, shape
// [{ label: "A", text: "..." }, ...]. onSelect/selected are optional,
// pass them if you want the buttons to track the student's pick.
const MathQuestion = ({ text, multiplechoice, options, onSelect, selected, accentColor = ACCENT }) => {
    if (!text) return null;

    // NEW — options can arrive either as an array of {label, text} objects
    // or as a plain object keyed by label (e.g. {A: "...", B: "..."}).
    // Normalize to an array so the rest of the component doesn't care which.
    const optionsArray = Array.isArray(options)
        ? options
        : options && typeof options === "object"
            ? Object.entries(options).map(([label, text]) => ({ label, text }))
            : [];

    return (
        <div>
            <MathText text={text} />

            {multiplechoice && optionsArray.length > 0 && (
                <div className="mt-4 flex flex-col gap-2 pointer-events-auto">
                    {optionsArray.map((opt) => {
                        const isSelected = selected === opt.label;
                        return (
                            <button
                                key={opt.label}
                                type="button"
                                onClick={() => onSelect?.(opt.label)}
                                className="text-left px-3 py-2 rounded-md border transition-colors"
                                style={{
                                    borderColor: isSelected ? accentColor : "#e5e7eb",
                                    borderWidth: isSelected ? 2 : 1,
                                    backgroundColor: isSelected ? `${accentColor}0D` : "transparent",
                                    boxShadow: isSelected ? `0 0 0 2px ${accentColor}26` : "none",
                                }}
                            >
                                <span className="font-semibold mr-2" style={{ color: isSelected ? accentColor : undefined }}>
                                    {opt.label}.
                                </span>
                                <MathText text={opt.text} />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};


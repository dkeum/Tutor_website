import { useState, useEffect, useRef, useCallback } from 'react'
import questions from '../assets/questions.json'

// If you host the diagram images somewhere other than /assessment-images/,
// update this base path. The images folder delivered alongside this file
// should be dropped into your public directory at this path (or adjust the
// path / swap this for an import map if you run them through a bundler).


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

export default function Assessment() {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(ASSESSMENT_DURATION_SECONDS)
  const [submitted, setSubmitted] = useState(false)
  const timerRef = useRef(null)

  const total = questions.length
  const current = questions[index]
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
    ? questions.reduce(
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
        questions={questions}
        answers={answers}
      />
    )
  }

  console.log(`../assets/${current.image}`)

  return (
    <div style={styles.page}>
      {/* Timer bar */}
      <div style={styles.timerBar(urgent)}>
        <div style={styles.timerBarInner}>
          <span style={styles.brand}>Mathmagick &mdash; Math 9/10 Assessment</span>
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
          <h2 style={styles.prompt}>{current.prompt}</h2>

          {current.image && (
            <div style={styles.imageWrap}>
              <img
                src={`./${current.image}`}
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
                  <span style={styles.optionText}>{opt.text}</span>
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
          {questions.map((q, i) => (
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
import React, { useState, useRef, useEffect, useCallback } from 'react'

// ---- Brand tokens (matches the rest of Mathamagic) ----
const TOKEN = {
    primary: '#4441c4',
    primaryDark: '#332f9e',
    border: '#c7c4d6',
    bg: '#ffffff',
    bgSoft: '#f6f5fb',
    correct: '#1f9d55',
    correctBg: '#e7f7ee',
    incorrect: '#d64545',
    incorrectBg: '#fdecec',
    font: "'Hanken Grotesk', sans-serif",
}

const ROWS = 10
const COLS = 8
const TOTAL_QUESTIONS = ROWS * COLS
const DURATION_SECONDS = 10 * 60

// digits = number of digits in the "big" number (row header). The column
// header is always a single digit (2-9), matching the drill sheet layout.
const DRILL_TYPES = [
    { key: 'mult-2x1', label: '2×1 Multiplication', op: 'mult', digits: 2 },
    { key: 'mult-3x1', label: '3×1 Multiplication', op: 'mult', digits: 3 },
    { key: 'div-2x1', label: '2×1 Division', op: 'div', digits: 2 },
    { key: 'div-3x1', label: '3×1 Division', op: 'div', digits: 3 },
]

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(arr) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

function randDigitNumber(digits) {
    const min = Math.pow(10, digits - 1)
    const max = Math.pow(10, digits) - 1
    return randInt(min, max)
}

// Division can't always land on a whole number when one row header is
// divided by 8 different column headers (2-9), so division answers are
// rounded to 2 decimal places. Grading allows a small tolerance for that.
function computeAnswer(op, rowVal, colVal) {
    if (op === 'mult') return rowVal * colVal
    return Math.round((rowVal / colVal) * 100) / 100
}

function generateGrid(config) {
    const colHeaders = shuffle([2, 3, 4, 5, 6, 7, 8, 9])
    const rowHeaders = Array.from({ length: ROWS }, () => randDigitNumber(config.digits))
    const answers = rowHeaders.map((r) => colHeaders.map((c) => computeAnswer(config.op, r, c)))
    return { colHeaders, rowHeaders, answers }
}

function emptyInputs() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(''))
}

function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
}

function resultForScore(score) {
    if (score < 20) {
        return {
            heading: 'Your child needs math help',
            message: 'Book a call with an expert that can help.',
            href: 'https://mathmagick.com/book-a-call',
            cta: 'Book a call',
        }
    }
    if (score <= 40) {
        return {
            heading: 'Ready for a bigger jump?',
            message: 'Sign up for a 12 week transformation program that will accelerate your learning.',
            href: 'https://mathmagick.com/transformation-program',
            cta: 'Join the program',
        }
    }
    return {
        heading: 'Great work',
        message: 'Want more ways to improve your education?',
        href: 'https://mathmagick.com',
        cta: 'Explore Mathamagic',
    }
}

const Drill = () => {
    const [drillKey, setDrillKey] = useState(DRILL_TYPES[0].key)
    const [grid, setGrid] = useState(() => generateGrid(DRILL_TYPES[0]))
    const [inputs, setInputs] = useState(emptyInputs)
    const [focused, setFocused] = useState({ row: 0, col: 0 })
    const [started, setStarted] = useState(false)
    const [finished, setFinished] = useState(false)
    const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS)
    const [result, setResult] = useState(null) // { score, timeSpent }

    const inputRefs = useRef({})
    const timerRef = useRef(null)

    const config = DRILL_TYPES.find((d) => d.key === drillKey)

    const regenerate = useCallback((key) => {
        const cfg = DRILL_TYPES.find((d) => d.key === key)
        setGrid(generateGrid(cfg))
        setInputs(emptyInputs())
        setFocused({ row: 0, col: 0 })
        setStarted(false)
        setFinished(false)
        setResult(null)
        setTimeLeft(DURATION_SECONDS)
        if (timerRef.current) clearInterval(timerRef.current)
    }, [])

    // Try to generate a drill as soon as the page loads.
    useEffect(() => {
        regenerate(DRILL_TYPES[0].key)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const finishDrill = useCallback(
        (currentInputs, secondsLeft) => {
            if (timerRef.current) clearInterval(timerRef.current)
            let score = 0
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const raw = currentInputs[r][c]
                    if (raw === '') continue
                    const val = parseFloat(raw)
                    if (!Number.isNaN(val) && Math.abs(val - grid.answers[r][c]) < 0.05) {
                        score++
                    }
                }
            }
            setFinished(true)
            setStarted(false)
            setResult({ score, timeSpent: DURATION_SECONDS - secondsLeft })
        },
        [grid]
    )

    useEffect(() => {
        if (!started) return
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current)
                    setInputs((currentInputs) => {
                        finishDrill(currentInputs, 0)
                        return currentInputs
                    })
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(timerRef.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [started])

    const handleStart = () => {
        setInputs(emptyInputs())
        setFinished(false)
        setResult(null)
        setTimeLeft(DURATION_SECONDS)
        setStarted(true)
        setFocused({ row: 0, col: 0 })
        requestAnimationFrame(() => inputRefs.current['0-0']?.focus())
    }

    const focusCell = (row, col) => {
        const ref = inputRefs.current[`${row}-${col}`]
        if (ref) ref.focus()
    }

    const nextCell = (row, col) => {
        if (row < ROWS - 1) return { row: row + 1, col }
        if (col < COLS - 1) return { row: 0, col: col + 1 }
        return null // reached the last cell of the last column
    }

    const handleChange = (row, col, value) => {
        if (!/^-?\d*\.?\d*$/.test(value)) return // digits (and one decimal point) only
        setInputs((prev) => {
            const next = prev.map((r) => [...r])
            next[row][col] = value
            // check for an early finish once every cell has something in it
            const allFilled = next.every((r) => r.every((v) => v !== ''))
            if (allFilled) {
                finishDrill(next, timeLeft)
            }
            return next
        })
    }

    const advance = (row, col) => {
        const next = nextCell(row, col)
        if (next) {
            setFocused(next)
            focusCell(next.row, next.col)
        }
    }

    const handleKeyDown = (row, col, e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            advance(row, col)
        }
    }

    const isHighlighted = (type, index) =>
        started && !finished && ((type === 'row' && focused.row === index) || (type === 'col' && focused.col === index))

    return (
        <div style={{ fontFamily: TOKEN.font }} className="w-full max-w-5xl mx-auto p-4">
            <div className="flex items-center gap-2 mb-4">
                <h1 className="text-2xl font-semibold mb-1" style={{ color: TOKEN.primaryDark }}>
                    Mathmagick
                </h1>
                <img src="./logo.png" width="30" height="30" />
            </div>

            <h1 className="text-2xl font-semibold mb-1" style={{ color: TOKEN.primaryDark }}>
                Arithmetic drill
            </h1>
            <p className="text-sm text-gray-500 mb-4">80 questions. 10 minutes. Answer as many as you can.</p>

            {/* Drill type selector */}
            <div className="flex flex-wrap gap-2 mb-3">
                {DRILL_TYPES.map((d) => (
                    <button
                        key={d.key}
                        onClick={() => {
                            setDrillKey(d.key)
                            regenerate(d.key)
                        }}
                        className="px-3 py-1.5 rounded-md text-sm font-medium border transition-colors"
                        style={
                            drillKey === d.key
                                ? { backgroundColor: TOKEN.primary, borderColor: TOKEN.primary, color: '#fff' }
                                : { backgroundColor: '#fff', borderColor: TOKEN.border, color: TOKEN.primaryDark }
                        }
                    >
                        {d.label}
                    </button>
                ))}
                <button
                    onClick={() => regenerate(drillKey)}
                    className="px-3 py-1.5 rounded-md text-sm font-medium border ml-auto"
                    style={{ backgroundColor: TOKEN.bgSoft, borderColor: TOKEN.border, color: TOKEN.primaryDark }}
                >
                    Generate new numbers
                </button>
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500">
                    {config.label} &middot; {TOTAL_QUESTIONS} questions
                </div>
                <div
                    className="text-lg font-semibold tabular-nums"
                    style={{ color: timeLeft <= 30 && started ? TOKEN.incorrect : TOKEN.primaryDark }}
                >
                    {started || finished ? formatTime(timeLeft) : formatTime(DURATION_SECONDS)}
                </div>
            </div>

            {/* Grid + overlays */}
            <div className="relative border rounded-lg overflow-hidden" style={{ borderColor: TOKEN.border }}>
                <div className="overflow-x-auto">
                    <table className="border-collapse w-full">
                        <thead>
                            <tr>
                                <th
                                    className="p-2 text-2xl font-bold border"
                                    style={{ borderColor: TOKEN.border, backgroundColor: TOKEN.bgSoft, color: config.op === 'mult' ? TOKEN.primary : TOKEN.primaryDark }}
                                >
                                    {config.op === 'mult' ? '×' : '÷'}
                                </th>
                                {grid.colHeaders.map((c, ci) => (
                                    <th
                                        key={ci}
                                        className="p-2 text-center font-semibold border min-w-[64px]"
                                        style={{
                                            borderColor: TOKEN.border,
                                            backgroundColor: isHighlighted('col', ci) ? TOKEN.primary : TOKEN.bgSoft,
                                            color: isHighlighted('col', ci) ? '#fff' : TOKEN.primaryDark,
                                        }}
                                    >
                                        {c}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {grid.rowHeaders.map((r, ri) => (
                                <tr key={ri}>
                                    <td
                                        className="p-2 text-center font-semibold border"
                                        style={{
                                            borderColor: TOKEN.border,
                                            backgroundColor: isHighlighted('row', ri) ? TOKEN.primary : TOKEN.bgSoft,
                                            color: isHighlighted('row', ri) ? '#fff' : TOKEN.primaryDark,
                                        }}
                                    >
                                        {r}
                                    </td>
                                    {grid.colHeaders.map((c, ci) => {
                                        const value = inputs[ri][ci]
                                        const showResult = finished && value !== ''
                                        const correct = showResult && Math.abs(parseFloat(value) - grid.answers[ri][ci]) < 0.05
                                        return (
                                            <td key={ci} className="border p-0" style={{ borderColor: TOKEN.border }}>
                                                <input
                                                    ref={(el) => (inputRefs.current[`${ri}-${ci}`] = el)}
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={value}
                                                    disabled={!started || finished}
                                                    onFocus={() => setFocused({ row: ri, col: ci })}
                                                    onChange={(e) => handleChange(ri, ci, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(ri, ci, e)}
                                                    className="w-full h-10 text-center outline-none disabled:cursor-not-allowed"
                                                    style={{
                                                        backgroundColor: showResult ? (correct ? TOKEN.correctBg : TOKEN.incorrectBg) : '#fff',
                                                        color: showResult ? (correct ? TOKEN.correct : TOKEN.incorrect) : '#111',
                                                    }}
                                                />
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Start overlay */}
                {!started && !finished && (
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
                    >
                        <button
                            onClick={handleStart}
                            className="px-6 py-3 rounded-full text-white font-semibold text-lg shadow-md"
                            style={{ backgroundColor: TOKEN.primary }}
                        >
                            Start drill
                        </button>
                    </div>
                )}

                {/* Results modal */}
                {finished && result && (
                    <div className="absolute inset-0 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(20,18,50,0.55)' }}>
                        <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center">
                            <div className="text-sm text-gray-500 mb-1">Your score</div>
                            <div className="text-4xl font-bold mb-3" style={{ color: TOKEN.primary }}>
                                {result.score} / {TOTAL_QUESTIONS}
                            </div>
                            <div className="text-sm text-gray-500 mb-4">Time spent: {formatTime(result.timeSpent)}</div>
                            <div className="text-base font-semibold mb-1" style={{ color: TOKEN.primaryDark }}>
                                {resultForScore(result.score).heading}
                            </div>
                            <p className="text-sm text-gray-600 mb-5">{resultForScore(result.score).message}</p>
                            <a
                                href={resultForScore(result.score).href}
                                className="inline-block px-5 py-2.5 rounded-full text-white font-medium"
                                style={{ backgroundColor: TOKEN.primary }}
                            >
                                {resultForScore(result.score).cta}
                            </a>
                            <div className="mt-4">
                                <button
                                    onClick={() => regenerate(drillKey)}
                                    className="text-sm underline"
                                    style={{ color: TOKEN.primaryDark }}
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Drill
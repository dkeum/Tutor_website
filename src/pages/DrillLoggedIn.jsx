import React, { useState, useRef, useEffect, useCallback } from 'react'
import axios from 'axios'
import LoggedInLayout from '../components/LoggedInLayout' // adjust path

const API_BASE =
    import.meta.env.VITE_ENVIRONMENT === 'DEVELOPMENT'
        ? 'http://localhost:3000'
        : 'https://mathamagic-backend.vercel.app'

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

const SAVE_LABEL = {
    saving: 'Saving your score…',
    saved: 'Score saved',
    error: "Couldn't save your score",
}

const DrillLoggedIn = () => {
    const [drillKey, setDrillKey] = useState(DRILL_TYPES[0].key)
    const [grid, setGrid] = useState(() => generateGrid(DRILL_TYPES[0]))
    const [inputs, setInputs] = useState(emptyInputs)
    const [focused, setFocused] = useState({ row: 0, col: 0 })
    const [started, setStarted] = useState(false)
    const [finished, setFinished] = useState(false)
    const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS)
    const [result, setResult] = useState(null) // { score, timeSpent }
    const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved | error

    const inputRefs = useRef({})
    const inputsRef = useRef(inputs)
    inputsRef.current = inputs
    const savedResultRef = useRef(null)

    const config = DRILL_TYPES.find((d) => d.key === drillKey)

    const regenerate = useCallback((key) => {
        const cfg = DRILL_TYPES.find((d) => d.key === key)
        setGrid(generateGrid(cfg))
        setInputs(emptyInputs())
        setFocused({ row: 0, col: 0 })
        setStarted(false)
        setFinished(false)
        setResult(null)
        setSaveStatus('idle')
        setTimeLeft(DURATION_SECONDS)
    }, [])

    useEffect(() => {
        regenerate(DRILL_TYPES[0].key)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const finishDrill = useCallback(
        (currentInputs, secondsLeft) => {
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

    // Countdown: just ticks the clock.
    useEffect(() => {
        if (!started) return
        const id = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
        return () => clearInterval(id)
    }, [started])

    // Time ran out.
    useEffect(() => {
        if (started && timeLeft <= 0) {
            finishDrill(inputsRef.current, 0)
        }
    }, [started, timeLeft, finishDrill])

    // Save the attempt once per finished drill.
    useEffect(() => {
        if (!finished || !result || savedResultRef.current === result) return
        savedResultRef.current = result
        setSaveStatus('saving')
        axios
            .post(
                `${API_BASE}/drill/submit-marks`,
                {
                    drillType: drillKey,
                    score: result.score,
                    timeTakenSeconds: result.timeSpent,
                },
                { withCredentials: true }
            )
            .then(() => setSaveStatus('saved'))
            .catch((err) => {
                console.error('Error saving drill attempt:', err)
                setSaveStatus('error')
            })
    }, [finished, result, drillKey])

    const handleStart = () => {
        setInputs(emptyInputs())
        setFinished(false)
        setResult(null)
        setSaveStatus('idle')
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
        return null
    }

    const handleChange = (row, col, value) => {
        if (!/^-?\d*\.?\d*$/.test(value)) return
        const next = inputs.map((r) => [...r])
        next[row][col] = value
        setInputs(next)
        // early finish once every cell has something in it
        if (next.every((r) => r.every((v) => v !== ''))) {
            finishDrill(next, timeLeft)
        }
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
        <LoggedInLayout>
            <div style={{ fontFamily: TOKEN.font }} className="w-full max-w-5xl mx-auto py-4">
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
                        {started || finished ? formatTime(Math.max(timeLeft, 0)) : formatTime(DURATION_SECONDS)}
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
                                <div className="text-sm text-gray-500 mb-1">Time spent: {formatTime(result.timeSpent)}</div>
                                {SAVE_LABEL[saveStatus] && (
                                    <div
                                        className="text-xs mb-5"
                                        style={{ color: saveStatus === 'error' ? TOKEN.incorrect : '#6b7280' }}
                                    >
                                        {SAVE_LABEL[saveStatus]}
                                    </div>
                                )}
                                <button
                                    onClick={() => regenerate(drillKey)}
                                    className="px-5 py-2.5 rounded-full text-white font-medium"
                                    style={{ backgroundColor: TOKEN.primary }}
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </LoggedInLayout>
    )
}

export default DrillLoggedIn
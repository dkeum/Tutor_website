import React, { useState } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import './HomeworkGroupTutoring.css'
import { supabase } from '../db/supabaseclient' // <- adjust to wherever your browser Supabase client lives
import LoggedInLayout from '../components/LoggedInLayout' // <- adjust path
import axios from 'axios'

const API_BASE =
    import.meta.env.VITE_ENVIRONMENT === 'DEVELOPMENT'
        ? 'http://localhost:3000'
        : 'https://mathamagic-backend.vercel.app'

// GRADE 8: 
// CODES: FRAC8


// GRADE 9 
//CODES: SQRT9 , EXPO9, 


//  GRADE 10 

/* ---------- helpers ---------- */

// Renders text with inline LaTeX, e.g. "Round $\sqrt{40}$ to the nearest tenth."
const Tex = ({ text }) => (
    <>
        {String(text)
            .split(/(\$[^$]+\$)/g)
            .map((part, i) =>
                part.length > 1 && part.startsWith('$') && part.endsWith('$') ? (
                    <span
                        key={i}
                        dangerouslySetInnerHTML={{
                            __html: katex.renderToString(part.slice(1, -1), { throwOnError: false }),
                        }}
                    />
                ) : (
                    <React.Fragment key={i}>{part}</React.Fragment>
                )
            )}
    </>
)

// "3/4" -> "$\dfrac{3}{4}$" (anything else is returned unchanged)
const fracTex = (s) => {
    const m = String(s).trim().match(/^(-?\d+)\s*\/\s*(\d+)$/)
    return m ? `$\\dfrac{${m[1]}}{${m[2]}}$` : String(s)
}

// LaTeX -> plain text, used only for the downloadable HTML files
const plain = (t) =>
    String(t)
        .replace(/\\dfrac\{([^}]*)\}\{([^}]*)\}/g, '($1/$2)')
        .replace(/\\sqrt\{([^}]*)\}/g, '√($1)')
        .replace(/\\approx/g, '≈')
        .replace(/\$/g, '')

const esc = (s) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Accepts "1.5", "3/4" and "2 3/4"
const toNumber = (s) => {
    s = String(s).trim().replace(',', '.')
    let m = s.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
    if (m) return Number(m[1]) + Number(m[2]) / Number(m[3])
    m = s.match(/^(\d+)\s*\/\s*(\d+)$/)
    if (m) return Number(m[1]) / Number(m[2])
    return s === '' ? NaN : Number(s)
}

const letters = (v) => String(v || '').toUpperCase().replace(/[^A-D]/g, '')

const filled = (q, v) => {
    if (!v) return false
    if (q.type === 'between') return !!(v[0] && v[1])
    if (q.type === 'check')
        return v[0] === 'Correct' || (v[0] === 'Incorrect' && String(v[1] || '').trim() !== '')
    return String(v).trim() !== ''
}

function grade(q, v) {
    switch (q.type) {
        case 'num':
        case 'frac':
        case 'est':
            return Math.abs(toNumber(v) - toNumber(q.a)) <= (q.tol || 1e-6)
        case 'between':
            return !!v && Number(v[0]) === q.a[0] && Number(v[1]) === q.a[1]
        case 'order':
            return letters(v) === q.a
        case 'check':
            return !!v && v[0] === q.a && (q.a === 'Correct' || Math.abs(toNumber(v[1]) - q.fix) <= 0.001)
        default: // tf, cmp, pick
            return v === q.a
    }
}

const showAnswer = (q, v) => {
    if (q.type === 'between') return v.join(' and ')
    if (q.type === 'order') return letters(v).split('').join(', ')
    if (q.type === 'check') return v[0] === 'Correct' ? 'Correct' : `Incorrect, should be ${v[1]}`
    return fracTex(String(v))
}
const showCorrect = (q) => {
    if (q.type === 'between') return q.a.join(' and ')
    if (q.type === 'order') return q.a.split('').join(', ')
    if (q.type === 'check') return q.a === 'Correct' ? 'Correct' : `Incorrect, should be ${q.fix}`
    if (q.type === 'frac') return fracTex(q.a)
    return q.disp || String(q.a)
}

/* ---------- figures (SVG strings, also reused in downloads) ---------- */

function numberLine(min, max, pts) {
    const W = 560
    const L = 26
    const S = (W - 2 * L) / (max - min)
    const x = (v) => (L + (v - min) * S).toFixed(1)
    let s = `<svg viewBox="0 0 ${W} 84" role="img" aria-label="Number line from ${min} to ${max}"><line x1="${L - 10}" x2="${W - L + 10}" y1="50" y2="50" stroke="currentColor" stroke-width="2"/>`
    for (let i = min; i <= max; i++) {
        s += `<line x1="${x(i)}" x2="${x(i)}" y1="43" y2="57" stroke="currentColor" stroke-width="2"/><text x="${x(i)}" y="76" text-anchor="middle" font-size="13" fill="currentColor">${i}</text>`
    }
    pts.forEach((p, i) => {
        const y = i % 2 ? 16 : 32
        s += `<line x1="${x(p.v)}" x2="${x(p.v)}" y1="${y + 4}" y2="45" stroke="currentColor" stroke-dasharray="2 2"/><circle cx="${x(p.v)}" cy="50" r="5.5" style="fill:var(--hgt-ac,#0b7a8c)"/><text x="${x(p.v)}" y="${y}" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">${p.l}</text>`
    })
    return s + '</svg>'
}

// Right triangle, right angle bottom-left. t = { v, h, vl, hl, cl } (leg sizes, leg labels, hypotenuse label)
function triangle(t) {
    const W = 280
    const H = 170
    const PL = 64 // room for the vertical leg label
    const PR = 20
    const PT = 24
    const PB = 36
    const k = Math.min((W - PL - PR) / t.h, (H - PT - PB) / t.v)
    const w = t.h * k
    const v = t.v * k
    const x = PL
    const y = H - PB
    const text = (s, tx, ty, anchor, bold) =>
        `<text x="${tx}" y="${ty}" text-anchor="${anchor}" font-size="14" ${bold ? 'font-style="italic" font-weight="700"' : ''} fill="currentColor">${s}</text>`
    return (
        `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Right triangle">` +
        `<polygon points="${x},${y} ${x + w},${y} ${x},${y - v}" fill-opacity=".15" style="fill:var(--hgt-ac,#0b7a8c)" stroke="currentColor" stroke-width="2"/>` +
        `<path d="M${x} ${y - 10}h10v10" fill="none" stroke="currentColor"/>` +
        text(t.vl, x - 8, y - v / 2 + 5, 'end') +
        text(t.hl, x + w / 2, y + 22, 'middle') +
        text(t.cl, x + w / 2 + 10, y - v / 2 - 6, 'start', true) +
        '</svg>'
    )
}

/* ---------- downloads ---------- */

function buildDownload(Q, hw, res) {
    const rows = Q.map((q, i) => {
        const r = res && res[i]
        const blank = {
            num: '______', frac: '______', est: '______', between: '____ and ____', cmp: '____',
            pick: '____', order: '__________', tf: 'Yes / No', check: 'Correct / Incorrect: ______',
        }[q.type]
        const answerLine = r
            ? `Your answer: ${esc(filled(q, r.v) ? plain(showAnswer(q, r.v)) : '(blank)')} &nbsp; <b>${r.ok ? '✓ Correct' : '✗ Correct answer: ' + esc(plain(showCorrect(q)))
            }</b>`
            : 'Answer: ' + esc(blank)
        const items = q.items
            ? '<p>' + q.items.map((t, j) => 'ABCD'[j] + '. ' + esc(plain(t))).join(' &nbsp; ') + '</p>'
            : ''
        const note = q.note ? `<p>${esc(q.note)}: ${r ? esc(r.note || '(blank)') : '______________________'}</p>` : ''
        const why = r && q.why ? `<p><i>${esc(plain(q.why))}</i></p>` : ''
        const fig = q.tri ? `<div class="fig">${triangle(q.tri)}</div>` : ''
        const nl = q.nl && (q.type === 'pick' || res) ? `<div class="fig">${numberLine(q.nl.min, q.nl.max, q.nl.pts)}</div>` : ''
        return `<div class="q"><b>${i + 1}.</b> ${esc(plain(q.q))}${items}${fig}${nl}<p>${answerLine}</p>${note}${why}</div>`
    }).join('')
    const top = res
        ? `<p><b>Score: ${res.filter((r) => r.ok).length} / ${Q.length}</b></p>`
        : '<p>Name: ______________________ &nbsp; Date: ____________</p>'
    const title = `${hw.topic_name} ${res ? 'results' : 'worksheet'}`
    return `<!doctype html><meta charset="utf-8"><title>${esc(title)}</title><style>body{font:15px/1.5 system-ui,sans-serif;max-width:760px;margin:24px auto;padding:0 16px;color:#111}.q{border:1px solid #bbb;border-radius:6px;padding:8px 12px;margin:8px 0;break-inside:avoid}.q p{margin:4px 0}.fig{max-width:420px;color:#111}.fig svg{width:100%;height:auto}</style><h1>Grade ${hw.grade}: ${esc(title)}</h1>${top}${rows}`
}

function downloadFile(filename, html) {
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

/* ---------- small components ---------- */

const Figure = ({ svg, className }) => (
    <div className={className} dangerouslySetInnerHTML={{ __html: svg }} />
)

const Items = ({ q }) =>
    q.items ? (
        <div className="hgt-items">
            {q.items.map((t, j) => (
                <span key={j}>
                    {'ABCD'[j]}. <Tex text={t} />
                </span>
            ))}
        </div>
    ) : null

const OPTIONS = {
    cmp: ['<', '=', '>'],
    pick: ['A', 'B', 'C', 'D'],
    tf: ['Yes', 'No'],
    check: ['Correct', 'Incorrect'],
}

function Field({ q, value, onChange }) {
    const { type } = q
    if (type === 'between') {
        const v = value || ['', '']
        return (
            <span>
                <input value={v[0]} inputMode="numeric" aria-label="Lower whole number" onChange={(e) => onChange([e.target.value, v[1]])} />{' '}
                and{' '}
                <input value={v[1]} inputMode="numeric" aria-label="Upper whole number" onChange={(e) => onChange([v[0], e.target.value])} />
            </span>
        )
    }
    if (OPTIONS[type]) {
        const v = type === 'check' ? value || ['', ''] : value || ''
        const sel = type === 'check' ? v[0] : v
        return (
            <span>
                <select
                    value={sel}
                    aria-label="Your answer"
                    onChange={(e) => onChange(type === 'check' ? [e.target.value, v[1]] : e.target.value)}
                >
                    <option value="">Choose</option>
                    {OPTIONS[type].map((o) => (
                        <option key={o} value={o}>{o}</option>
                    ))}
                </select>
                {type === 'check' && sel === 'Incorrect' && (
                    <>
                        {' '}
                        <input
                            value={v[1]}
                            className="hgt-wide"
                            placeholder="correct value"
                            inputMode="decimal"
                            aria-label="Corrected value"
                            onChange={(e) => onChange([v[0], e.target.value])}
                        />
                    </>
                )}
            </span>
        )
    }
    return (
        <input
            value={value || ''}
            className={type === 'order' || type === 'est' ? 'hgt-wide' : ''}
            inputMode={type === 'order' ? 'text' : 'decimal'}
            placeholder={type === 'order' ? 'e.g. BCDA' : type === 'frac' ? 'e.g. 3/4' : ''}
            maxLength={type === 'order' ? 12 : undefined}
            autoComplete="off"
            aria-label="Your answer"
            onChange={(e) => onChange(e.target.value)}
        />
    )
}

/* ---------- main component ---------- */

const Worksheet = ({ homework, onExit }) => {
    const Q = homework.questions
    const [answers, setAnswers] = useState({})
    const [notes, setNotes] = useState({})
    const [results, setResults] = useState(null)
    const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved | error

    const setAnswer = (i, v) => setAnswers((a) => ({ ...a, [i]: v }))
    const setNote = (i, v) => setNotes((n) => ({ ...n, [i]: v }))
    const answered = Q.filter((q, i) => filled(q, answers[i])).length

    const submit = () => {
        const graded = Q.map((q, i) => ({ q, v: answers[i], note: notes[i], ok: grade(q, answers[i]) }))
        setResults(graded)
        window.scrollTo(0, 0)

        setSaveStatus('saving')
        axios
            .post(
                `${API_BASE}/worksheet/submit-marks`,
                {
                    accessCode: homework.access_code,
                    numCorrect: graded.filter((r) => r.ok).length,
                },
                { withCredentials: true }
            )
            .then(() => setSaveStatus('saved'))
            .catch((err) => {
                console.error('Error saving worksheet score:', err)
                setSaveStatus('error')
            })
    }
    const retry = () => {
        setAnswers({})
        setNotes({})
        setResults(null)
        setSaveStatus('idle')
        window.scrollTo(0, 0)
    }

    /* results screen */
    if (results) {
        const score = results.filter((r) => r.ok).length
        const pct = Math.round((100 * score) / Q.length)
        return (
            <div className="hgt">
                <h1>Your results</h1>
                <div className="hgt-q">
                    <div className="hgt-score">{score} / {Q.length}</div>
                    <p className="hgt-sub">
                        {pct}% ·{' '}
                        {pct >= 80 ? 'Strong work.' : pct >= 60 ? 'Good effort. Review the ones marked wrong.' : 'Keep practising. Check the correct answers below.'}
                    </p>
                    <p className="hgt-sub">
                        {saveStatus === 'saving' && 'Saving your score…'}
                        {saveStatus === 'saved' && 'Score saved'}
                        {saveStatus === 'error' && "Couldn't save your score"}
                    </p>
                </div>
                <div className="hgt-bar">
                    <button onClick={() => downloadFile(`${homework.access_code}-results.html`, buildDownload(Q, homework, results))}>Download results</button>
                    <button className="hgt-alt" onClick={retry}>Try again</button>
                    <button className="hgt-alt" onClick={onExit}>Enter a different code</button>
                </div>
                <div className="hgt-grid">
                    {results.map(({ q, v, note, ok }, i) => (
                        <div key={i} className={`hgt-q ${ok ? 'hgt-ok' : 'hgt-no'}${q.full ? ' hgt-full' : ''}`}>
                            <p className="hgt-text"><span className="hgt-n">{i + 1}.</span><Tex text={q.q} /></p>
                            <Items q={q} />
                            <p className="hgt-res">
                                <span className={`hgt-tag ${ok ? 'hgt-ok' : 'hgt-no'}`}>{ok ? '✓' : '✗'}</span>{' '}
                                {filled(q, v) ? <Tex text={showAnswer(q, v)} /> : '(blank)'}
                                {!ok && (<> · Answer: <b><Tex text={showCorrect(q)} /></b></>)}
                            </p>
                            {q.note && <p className="hgt-res hgt-mut">{q.note}: {note || '(blank)'}</p>}
                            {q.why && <p className="hgt-res hgt-mut"><Tex text={q.why} /></p>}
                            {q.tri && <Figure className="hgt-fig" svg={triangle(q.tri)} />}
                            {q.nl && (q.rev || q.type === 'pick') && <Figure className="hgt-nl" svg={numberLine(q.nl.min, q.nl.max, q.nl.pts)} />}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    /* worksheet screen */
    return (
        <div className="hgt">
            <h1>Grade {homework.grade}: {homework.topic_name}</h1>
            {homework.description && <p className="hgt-sub">{homework.description}</p>}
            <p className="hgt-sub">Answer every question, then press Submit. It is marked for you straight away.</p>
            <button className="hgt-alt" onClick={() => downloadFile(`${homework.access_code}-worksheet.html`, buildDownload(Q, homework, null))}>
                Download worksheet
            </button>{' '}
            <button className="hgt-alt" onClick={onExit}>Enter a different code</button>
            <div className="hgt-grid">
                {Q.map((q, i) => (
                    <div key={i} className={`hgt-q${q.full ? ' hgt-full' : ''}`}>
                        <p className="hgt-text"><span className="hgt-n">{i + 1}.</span><Tex text={q.q} /></p>
                        <Items q={q} />
                        <Field q={q} value={answers[i]} onChange={(v) => setAnswer(i, v)} />
                        {q.note && (
                            <input
                                className="hgt-note"
                                placeholder={q.note}
                                aria-label={q.note}
                                value={notes[i] || ''}
                                onChange={(e) => setNote(i, e.target.value)}
                            />
                        )}
                        {q.tri && <Figure className="hgt-fig" svg={triangle(q.tri)} />}
                        {q.type === 'pick' && <Figure className="hgt-nl" svg={numberLine(q.nl.min, q.nl.max, q.nl.pts)} />}
                    </div>
                ))}
            </div>
            <div className="hgt-bar">
                <button onClick={submit}>Submit</button>
                <span className="hgt-msg">
                    {answered} of {Q.length} answered{answered < Q.length ? '. Blank answers count as incorrect.' : ''}
                </span>
            </div>
        </div>
    )
}

/* ---------- code entry, then loads the homework ---------- */

const HomeworkGroupLoggedIn = () => {
    const [codeInput, setCodeInput] = useState('')
    const [homework, setHomework] = useState(null)
    const [status, setStatus] = useState('idle') // idle | loading | ready | missing | error
    const [triedCode, setTriedCode] = useState('')

    const loadHomework = async (e) => {
        e.preventDefault()
        const code = codeInput.trim().toUpperCase()
        if (!code) return

        setStatus('loading')
        setTriedCode(code)

        const { data, error } = await supabase
            .from('homework')
            .select('id, grade, access_code, topic_name, description, questions, total_points')
            .eq('access_code', code)
            .eq('is_published', true)
            .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
            .maybeSingle()

        if (error) return setStatus('error')
        if (!data || !Array.isArray(data.questions) || data.questions.length === 0) return setStatus('missing')

        setHomework(data)
        setStatus('ready')
    }

    const exitHomework = () => {
        setHomework(null)
        setCodeInput('')
        setStatus('idle')
        window.scrollTo(0, 0)
    }

    if (status === 'ready' && homework) {
        return (
            <LoggedInLayout>
                <Worksheet key={homework.id} homework={homework} onExit={exitHomework} />
            </LoggedInLayout>
        )
    }

    return (
        <LoggedInLayout>
            <div className="hgt">
                <h1>Enter your homework code</h1>
                <p className="hgt-sub">Your tutor gave you a code. Type it in below to open your homework.</p>

                <form onSubmit={loadHomework}>
                    <input
                        value={codeInput}
                        className="hgt-wide"
                        placeholder="e.g. SQRT9"
                        autoComplete="off"
                        autoCapitalize="characters"
                        spellCheck={false}
                        aria-label="Homework code"
                        onChange={(e) => {
                            setCodeInput(e.target.value)
                            if (status === 'missing' || status === 'error') setStatus('idle')
                        }}
                    />{' '}
                    <button type="submit" disabled={status === 'loading' || !codeInput.trim()}>
                        {status === 'loading' ? 'Checking…' : 'Open homework'}
                    </button>
                </form>

                {status === 'missing' && (
                    <p className="hgt-sub" role="alert">
                        We couldn't find homework for the code "{triedCode}". Check the code you were given and try again.
                    </p>
                )}
                {status === 'error' && (
                    <p className="hgt-sub" role="alert">
                        Something went wrong loading the homework. Please try again.
                    </p>
                )}
            </div>
        </LoggedInLayout>
    )
}

export default HomeworkGroupLoggedIn
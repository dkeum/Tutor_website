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
// CODES: FRAC8, FDP8, DECOPS8, GEOM8


// GRADE 9 
//CODES: SQRT9 , EXPO9, POLY9


//  GRADE 10 
// CODES: SLOPE10 (4.1), ROC10 (4.2), LINFN10 (4.3)

/* ---------- helpers ---------- */

// Renders text with inline LaTeX, e.g. "Round $\sqrt{40}$ to the nearest tenth."
// NOTE: a literal dollar sign in question text will be read as the start of LaTeX, so write "dollars" instead of "$".
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
        .replace(/\\text\{([^}]*)\}/g, '$1')
        .replace(/\\pi/g, 'π')
        .replace(/\\times/g, '×')
        .replace(/\^2/g, '²')
        .replace(/\$/g, '')

const esc = (s) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Accepts "1.5", "3/4", "2 3/4", negatives such as "-3/4", and "2,750" / "$11.50"
const toNumber = (s) => {
    s = String(s)
        .trim()
        .replace('−', '-') // typographic minus
        .replace(/^\$/, '')
        .replace(/(\d),(\d{3})(?!\d)/g, '$1$2') // thousands separator
        .replace(',', '.')
    let m = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/)
    if (m) return (m[1] ? -1 : 1) * (Number(m[2]) + Number(m[3]) / Number(m[4]))
    m = s.match(/^(-?\d+)\s*\/\s*(\d+)$/)
    if (m) return Number(m[1]) / Number(m[2])
    return s === '' ? NaN : Number(s)
}

const letters = (v) => String(v || '').toUpperCase().replace(/[^A-D]/g, '')

// graph questions: how many points the student still has to place (a question may give one point for free)
const same = (a, b) => a[0] === b[0] && a[1] === b[1]
const ptText = (p) => `(${p[0]}, ${p[1]})`
const plotNeed = (q) => 2 - (q.given || []).length

const filled = (q, v) => {
    if (!v) return false
    if (q.type === 'plot') return Array.isArray(v) && v.length === plotNeed(q)
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
        case 'plot': {
            // q.line = two points on the target line.
            // Default: ANY two different points on that line are accepted.
            // q.exact = true: the student must plot exactly the two points in q.line.
            if (!filled(q, v)) return false
            const pts = [...(q.given || []), ...v]
            if (same(pts[0], pts[1])) return false
            if (q.exact) return q.line.every((t) => pts.some((p) => same(p, t)))
            const [a, b] = q.line
            return pts.every(
                (p) => Math.abs((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) < 1e-6
            )
        }
        default: // tf, cmp, pick
            return v === q.a
    }
}

const showAnswer = (q, v) => {
    if (q.type === 'plot') return [...(q.given || []), ...v].map(ptText).join(' and ')
    if (q.type === 'between') return v.join(' and ')
    if (q.type === 'order') return letters(v).split('').join(', ')
    if (q.type === 'check') return v[0] === 'Correct' ? 'Correct' : `Incorrect, should be ${v[1]}`
    return fracTex(String(v))
}
const showCorrect = (q) => {
    if (q.type === 'plot')
        return q.exact
            ? q.line.map(ptText).join(' and ')
            : `Any two points on the line through ${q.line.map(ptText).join(' and ')}`
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

/* ---------- coordinate grid (graph questions) ---------- */

// Default grid is -6..6 on both axes. A question can override any of this with q.grid, e.g.
// { xmin: 0, xmax: 10, ymin: 0, ymax: 30000, ystep: 2500, xlabel: 'Years', ylabel: 'Value ($)' }
// Every grid line is a spot the student can click, so points must sit on a multiple of xstep / ystep.
const GRID = { xmin: -6, xmax: 6, ymin: -6, ymax: 6, xstep: 1, ystep: 1 }

// Geometry shared by drawing and click-snapping. spec = anything with an optional .grid
function graphGeom(spec) {
    const g = { ...GRID, ...(spec.grid || {}) }
    const W = 380
    const H = 368
    const PL = 56 // room for y labels
    const PR = 16
    const PT = 16
    const PB = 44 // room for x labels
    const PW = W - PL - PR
    const PH = H - PT - PB
    const xc = Math.round((g.xmax - g.xmin) / g.xstep) // number of cells across
    const yc = Math.round((g.ymax - g.ymin) / g.ystep)
    const X = (v) => PL + ((v - g.xmin) / (g.xmax - g.xmin)) * PW
    const Y = (v) => PT + PH - ((v - g.ymin) / (g.ymax - g.ymin)) * PH
    // svg pixel -> nearest grid intersection (null if the click was outside the grid)
    const snap = (px, py) => {
        if (px < PL - 12 || px > PL + PW + 12 || py < PT - 12 || py > PT + PH + 12) return null
        const cx = Math.min(xc, Math.max(0, Math.round(((px - PL) / PW) * xc)))
        const cy = Math.min(yc, Math.max(0, Math.round(((PT + PH - py) / PH) * yc)))
        return [Number((g.xmin + cx * g.xstep).toFixed(6)), Number((g.ymin + cy * g.ystep).toFixed(6))]
    }
    return { g, W, H, PL, PT, PW, PH, xc, yc, X, Y, snap }
}

// Extends the line through point p with direction d until it leaves the grid box b (Liang-Barsky clipping)
function clipLine(p, d, b) {
    let t0 = -Infinity
    let t1 = Infinity
    const axis = (p0, dd, lo, hi) => {
        if (dd === 0) return p0 >= lo && p0 <= hi
        let a = (lo - p0) / dd
        let c = (hi - p0) / dd
        if (a > c) [a, c] = [c, a]
        t0 = Math.max(t0, a)
        t1 = Math.min(t1, c)
        return t0 <= t1
    }
    if (!axis(p[0], d[0], b.xmin, b.xmax) || !axis(p[1], d[1], b.ymin, b.ymax)) return null
    return [[p[0] + t0 * d[0], p[1] + t0 * d[1]], [p[0] + t1 * d[0], p[1] + t1 * d[1]]]
}

// o = {
//   given: points drawn hollow (locked),
//   pts:   the student's points (filled),
//   line:  [p1, p2], line drawn solid through two points, extended to the edges of the grid,
//   key:   [p1, p2], correct line drawn dashed (results + downloads only)
// }
function graphSvg(spec, o = {}) {
    const { g, W, H, PL, PT, PW, PH, xc, yc, X, Y } = graphGeom(spec)
    const n = (v) => String(Number(v.toFixed(6)))
    const sx = Math.ceil((xc + 1) / 13) // label every n-th grid line so long axes stay readable
    const sy = Math.ceil((yc + 1) / 13)
    // inline sizing so the graph shows even if .hgt-graph has no CSS yet
    let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="display:block;width:100%;max-width:${W}px;height:auto" role="img" aria-label="Coordinate grid">`

    for (let i = 0; i <= xc; i++) {
        const v = g.xmin + i * g.xstep
        const px = X(v).toFixed(1)
        s += `<line x1="${px}" x2="${px}" y1="${PT}" y2="${PT + PH}" stroke="currentColor" stroke-opacity=".18"/>`
        if (i % sx === 0) s += `<text x="${px}" y="${PT + PH + 16}" text-anchor="middle" font-size="12" fill="currentColor">${n(v)}</text>`
    }
    for (let i = 0; i <= yc; i++) {
        const v = g.ymin + i * g.ystep
        const py = Y(v).toFixed(1)
        s += `<line x1="${PL}" x2="${PL + PW}" y1="${py}" y2="${py}" stroke="currentColor" stroke-opacity=".18"/>`
        if (i % sy === 0) s += `<text x="${PL - 8}" y="${(Y(v) + 4).toFixed(1)}" text-anchor="end" font-size="12" fill="currentColor">${n(v)}</text>`
    }
    // axes (only drawn when 0 is inside the grid) and a frame
    if (g.xmin <= 0 && g.xmax >= 0) s += `<line x1="${X(0).toFixed(1)}" x2="${X(0).toFixed(1)}" y1="${PT}" y2="${PT + PH}" stroke="currentColor" stroke-width="2"/>`
    if (g.ymin <= 0 && g.ymax >= 0) s += `<line x1="${PL}" x2="${PL + PW}" y1="${Y(0).toFixed(1)}" y2="${Y(0).toFixed(1)}" stroke="currentColor" stroke-width="2"/>`
    s += `<rect x="${PL}" y="${PT}" width="${PW}" height="${PH}" fill="none" stroke="currentColor" stroke-opacity=".5"/>`
    if (g.xlabel) s += `<text x="${PL + PW / 2}" y="${H - 6}" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor">${esc(g.xlabel)}</text>`
    if (g.ylabel) s += `<text x="12" y="${PT + PH / 2}" text-anchor="middle" font-size="13" font-weight="700" fill="currentColor" transform="rotate(-90 12 ${PT + PH / 2})">${esc(g.ylabel)}</text>`

    const line = (pair, dashed) => {
        if (!pair || pair.length < 2 || same(pair[0], pair[1])) return ''
        const c = clipLine(pair[0], [pair[1][0] - pair[0][0], pair[1][1] - pair[0][1]], g)
        if (!c) return ''
        return `<line x1="${X(c[0][0]).toFixed(1)}" y1="${Y(c[0][1]).toFixed(1)}" x2="${X(c[1][0]).toFixed(1)}" y2="${Y(c[1][1]).toFixed(1)}" stroke-linecap="round" ${dashed
            ? 'stroke="currentColor" stroke-width="2" stroke-dasharray="7 5"'
            : 'stroke-width="3" style="stroke:var(--hgt-ac,#0b7a8c)"'}/>`
    }
    const dot = (p, hollow) => {
        const px = X(p[0])
        const py = Y(p[1])
        const right = px > W - 90
        return (
            `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${hollow ? 5 : 6}" ` +
            (hollow ? 'fill="none" stroke-width="2.5" style="stroke:var(--hgt-ac,#0b7a8c)"' : 'style="fill:var(--hgt-ac,#0b7a8c)"') +
            '/>' +
            `<text x="${(right ? px - 9 : px + 9).toFixed(1)}" y="${Math.max(PT + 12, py - 9).toFixed(1)}" text-anchor="${right ? 'end' : 'start'}" font-size="12" font-weight="700" fill="currentColor">${ptText(p.map((v) => Number(v.toFixed(6))))}</text>`
        )
    }

    s += line(o.key, true) + line(o.line, false)
        ; (o.given || []).forEach((p) => (s += dot(p, true)))
        ; (o.pts || []).forEach((p) => (s += dot(p, false)))
    return s + '</svg>'
}

// the interactive plot figure: given points + student's points, with the line drawn once two points exist
const plotSvg = (q, v, reveal) => {
    const given = q.given || []
    const pts = Array.isArray(v) ? v : []
    const both = [...given, ...pts]
    return graphSvg(q, { given, pts, line: both.length === 2 ? both : null, key: reveal ? q.line : null })
}

// a read-only graph for "find the slope / intercept of this line" questions
// q.graph = { grid?, pts: [[x, y], ...] (points marked on the line), line: [p1, p2] }
const staticSvg = (q) => graphSvg(q.graph, { given: q.graph.pts, line: q.graph.line })

/* ---------- geometry diagrams: prisms, parallelogram, triangle, circle ---------- */

// A question opts in with q.shape = { kind, ...sizes, labels }
//   rprism        { l, w, h, labels: { l, w, h } }                 rectangular prism
//   tprism        { b, h, len, right?, labels: { b, h, s, l } }    triangular prism (right: true = right-angle ends)
//   parallelogram { b, h, labels: { b, h, s } }
//   triangle      { b, h, apex?, labels: { b, h } }                apex 0 = right triangle, default 0.4
//   circle        { show?: 'r' | 'd', labels: { r, d } }
// The numbers only set the proportions of the drawing. The text students read comes from labels,
// so use '?' for an unknown side, e.g. labels: { h: '? cm' }.

const FIG_W = 300
const FIG_H = 200

const fx = (n) => Number(n).toFixed(1)
const ftext = (t, x, y, anchor = 'middle') =>
    t ? `<text x="${fx(x)}" y="${fx(y)}" text-anchor="${anchor}" font-size="14" fill="currentColor">${esc(t)}</text>` : ''
const fseg = (a, b, dashed) =>
    `<line x1="${fx(a[0])}" y1="${fx(a[1])}" x2="${fx(b[0])}" y2="${fx(b[1])}" stroke="currentColor" stroke-width="2"${dashed ? ' stroke-dasharray="5 4" stroke-opacity=".7"' : ''}/>`
const fpoly = (pts, op) =>
    `<polygon points="${pts.map((p) => fx(p[0]) + ',' + fx(p[1])).join(' ')}" fill-opacity="${op}" style="fill:var(--hgt-ac,#0b7a8c)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`
// small right-angle square at corner p; sx and sy are +1 or -1 and point into the shape
const fsquare = (p, sx, sy) =>
    `<path d="M${fx(p[0] + sx * 9)} ${fx(p[1])}L${fx(p[0] + sx * 9)} ${fx(p[1] + sy * 9)}L${fx(p[0])} ${fx(p[1] + sy * 9)}" fill="none" stroke="currentColor"/>`

function rPrismFig(s) {
    const L = s.labels || {}
    const m = Math.max(s.l, s.w, s.h)
    const fw = 50 + 100 * (s.l / m)
    const fh = 30 + 70 * (s.h / m)
    const dx = 18 + 30 * (s.w / m)
    const dy = dx * 0.6
    const x0 = 46
    const y0 = FIG_H - 30
    const A = [x0, y0]
    const B = [x0 + fw, y0]
    const C = [x0 + fw, y0 - fh]
    const D = [x0, y0 - fh]
    const o = (p) => [p[0] + dx, p[1] - dy]
    const A2 = o(A)
    const B2 = o(B)
    const C2 = o(C)
    const D2 = o(D)
    return (
        fpoly([D, C, C2, D2], 0.08) + fpoly([B, B2, C2, C], 0.22) + fpoly([A, B, C, D], 0.12) +
        fseg(A, A2, true) + fseg(A2, B2, true) + fseg(A2, D2, true) + // hidden edges
        ftext(L.l, x0 + fw / 2, y0 + 18) +
        ftext(L.h, x0 - 8, y0 - fh / 2 + 5, 'end') +
        ftext(L.w, B[0] + dx / 2 + 8, B[1] - dy / 2 + 16, 'start')
    )
}

function tPrismFig(s) {
    const L = s.labels || {}
    const m = Math.max(s.b, s.h)
    const bw = 70 + 70 * (s.b / m)
    const th = 45 + 40 * (s.h / m)
    const dx = 24 + 24 * (s.len / Math.max(s.len, s.b, s.h))
    const dy = dx * 0.5
    const x0 = 46
    const y0 = FIG_H - 34
    const P = [x0, y0]
    const Q = [x0 + bw, y0]
    const T = [x0 + (s.right ? 0 : bw / 2), y0 - th]
    const o = (p) => [p[0] + dx, p[1] - dy]
    const P2 = o(P)
    const Q2 = o(Q)
    const T2 = o(T)
    const faceMid = [(T[0] + Q[0]) / 2 + dx / 2, (T[1] + Q[1]) / 2 - dy / 2]
    let g =
        fpoly([T, Q, Q2, T2], 0.22) + fpoly([P, Q, T], 0.12) +
        fseg(P, P2, true) + fseg(P2, Q2, true) + fseg(P2, T2, true) // hidden edges
    if (s.right) {
        g += fsquare(P, 1, -1) + ftext(L.h, x0 - 8, y0 - th / 2 + 5, 'end')
    } else {
        g += fseg(T, [T[0], y0], true) + fsquare([T[0], y0], 1, -1) + ftext(L.h, T[0] + 6, y0 - th / 2 + 5, 'start')
    }
    return (
        g +
        ftext(L.b, x0 + bw / 2, y0 + 18) +
        ftext(L.s, faceMid[0], faceMid[1] + 5) +
        ftext(L.l, (Q[0] + Q2[0]) / 2 + 8, (Q[1] + Q2[1]) / 2 + 16, 'start')
    )
}

function parallelogramFig(s) {
    const L = s.labels || {}
    const bw = 140
    const ph = Math.max(55, Math.min(95, bw * (s.h / s.b)))
    const skew = 40
    const x0 = 40
    const y0 = FIG_H - 40
    const P1 = [x0, y0]
    const P2 = [x0 + bw, y0]
    const P3 = [x0 + bw + skew, y0 - ph]
    const P4 = [x0 + skew, y0 - ph]
    return (
        fpoly([P1, P2, P3, P4], 0.15) +
        fseg(P4, [P4[0], y0], true) + fsquare([P4[0], y0], 1, -1) +
        ftext(L.b, x0 + bw / 2, y0 + 20) +
        ftext(L.h, P4[0] + 6, y0 - ph / 2 + 5, 'start') +
        ftext(L.s, (P2[0] + P3[0]) / 2 + 10, (P2[1] + P3[1]) / 2 + 5, 'start')
    )
}

// named areaTriangleFig because triangle() above already draws the right triangle used in other worksheets
function areaTriangleFig(s) {
    const L = s.labels || {}
    const apex = s.apex === undefined ? 0.4 : s.apex
    const bw = 150
    const th = Math.max(60, Math.min(100, bw * (s.h / s.b)))
    const x0 = 50
    const y0 = FIG_H - 40
    const P = [x0, y0]
    const Q = [x0 + bw, y0]
    const T = [x0 + bw * apex, y0 - th]
    let g = fpoly([P, Q, T], 0.15)
    if (apex > 0 && apex < 1) {
        const left = apex > 0.5
        g += fseg(T, [T[0], y0], true) + fsquare([T[0], y0], left ? -1 : 1, -1) +
            ftext(L.h, T[0] + (left ? -6 : 6), y0 - th / 2 + 5, left ? 'end' : 'start')
    } else {
        const atLeft = apex === 0
        g += fsquare(atLeft ? P : Q, atLeft ? 1 : -1, -1) +
            ftext(L.h, atLeft ? x0 - 8 : x0 + bw + 8, y0 - th / 2 + 5, atLeft ? 'end' : 'start')
    }
    return g + ftext(L.b, x0 + bw / 2, y0 + 20)
}

function circleFig(s) {
    const L = s.labels || {}
    const cx = FIG_W / 2
    const cy = FIG_H / 2
    const r = 72
    const showD = s.show === 'd'
    const a = showD ? [cx - r, cy] : [cx, cy]
    const b = [cx + r, cy]
    return (
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill-opacity="0.15" style="fill:var(--hgt-ac,#0b7a8c)" stroke="currentColor" stroke-width="2"/>` +
        fseg(a, b) +
        `<circle cx="${cx}" cy="${cy}" r="3.5" fill="currentColor"/>` +
        ftext(showD ? L.d : L.r, (a[0] + b[0]) / 2, cy - 8)
    )
}

const FIGS = {
    rprism: rPrismFig,
    tprism: tPrismFig,
    parallelogram: parallelogramFig,
    triangle: areaTriangleFig,
    circle: circleFig,
}

const shapeSvg = (s) =>
    FIGS[s.kind]
        ? `<svg viewBox="0 0 ${FIG_W} ${FIG_H}" width="${FIG_W}" height="${FIG_H}" style="display:block;width:100%;max-width:${FIG_W}px;height:auto" role="img" aria-label="${esc(s.kind)} diagram">${FIGS[s.kind](s)}</svg>`
        : ''

/* ---------- downloads ---------- */

function buildDownload(Q, hw, res) {
    const rows = Q.map((q, i) => {
        const r = res && res[i]
        const blank = {
            num: '______', frac: '______', est: '______', between: '____ and ____', cmp: '____',
            pick: '____', order: '__________', tf: 'Yes / No', check: 'Correct / Incorrect: ______',
            plot: 'Plot on the grid below',
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
        const graph = q.type === 'plot'
            ? `<div class="fig">${plotSvg(q, r ? r.v : null, !!r)}</div>`
            : q.graph ? `<div class="fig">${staticSvg(q)}</div>` : ''
        const shape = q.shape ? `<div class="fig">${shapeSvg(q.shape)}</div>` : ''
        return `<div class="q"><b>${i + 1}.</b> ${esc(plain(q.q))}${items}${fig}${nl}${graph}${shape}<p>${answerLine}</p>${note}${why}</div>`
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

// Click the grid to place points (they snap to the nearest grid intersection).
// Once there are two points (given + placed) a line is drawn through them.
// Click a placed point to remove it. If the student clicks a third spot, the oldest placed point is replaced.
// The answer stored for the question is just the array of points the student placed, e.g. [[0, -3], [2, 5]]
function GraphField({ q, value, onChange }) {
    const need = plotNeed(q)
    const pts = Array.isArray(value) ? value : []
    const geom = graphGeom(q)

    const place = (e) => {
        const box = e.currentTarget.querySelector('svg').getBoundingClientRect()
        const p = geom.snap(
            ((e.clientX - box.left) / box.width) * geom.W,
            ((e.clientY - box.top) / box.height) * geom.H
        )
        if (!p || (q.given || []).some((g) => same(g, p))) return
        const hit = pts.findIndex((x) => same(x, p))
        onChange(hit >= 0 ? pts.filter((_, j) => j !== hit) : [...pts, p].slice(-need))
    }

    const left = need - pts.length
    return (
        <div>
            <div
                className="hgt-graph hgt-click"
                role="group"
                aria-label="Coordinate grid. Click to place points."
                onClick={place}
                dangerouslySetInnerHTML={{ __html: plotSvg(q, pts, false) }}
            />
            <p className="hgt-sub">
                {left > 0
                    ? `Click the grid to place ${left} more point${left > 1 ? 's' : ''}.`
                    : 'Line drawn. Click a point to remove it, or click another spot to replace the oldest point.'}
                {pts.length > 0 && <> Your points: {pts.map(ptText).join(', ')}</>}
            </p>
            {pts.length > 0 && (
                <button type="button" className="hgt-alt" onClick={() => onChange([])}>
                    Clear points
                </button>
            )}
        </div>
    )
}

function Field({ q, value, onChange }) {
    const { type } = q
    // Multiple-choice questions use the "order" type with a one-letter answer
    const singleLetter = type === 'order' && String(q.a).length === 1

    if (type === 'plot') return <GraphField q={q} value={value} onChange={onChange} />

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
                            inputMode={q.neg ? 'text' : 'decimal'}
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
            className={(type === 'order' && !singleLetter) || type === 'est' ? 'hgt-wide' : ''}
            inputMode={type === 'order' || q.neg ? 'text' : 'decimal'}
            placeholder={
                type === 'order'
                    ? singleLetter ? 'Type a letter' : 'e.g. BCDA'
                    : type === 'frac' ? 'e.g. 3/4' : ''
            }
            maxLength={type === 'order' ? (singleLetter ? 1 : 12) : undefined}
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
                            {q.graph && <Figure className="hgt-graph" svg={staticSvg(q)} />}
                            {q.shape && <Figure className="hgt-fig" svg={shapeSvg(q.shape)} />}
                            {/* student's line is solid, the correct line is dashed */}
                            {q.type === 'plot' && <Figure className="hgt-graph" svg={plotSvg(q, v, true)} />}
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
                        {q.graph && <Figure className="hgt-graph" svg={staticSvg(q)} />}
                        {q.shape && <Figure className="hgt-fig" svg={shapeSvg(q.shape)} />}
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
                        {q.type === 'pick' && q.nl && <Figure className="hgt-nl" svg={numberLine(q.nl.min, q.nl.max, q.nl.pts)} />}
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
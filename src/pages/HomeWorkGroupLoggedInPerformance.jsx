import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as d3 from "d3";
import LoggedInLayout from "../components/LoggedInLayout"; // adjust path

const API_BASE =
    import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
        ? "http://localhost:3000"
        : "https://mathamagic-backend.vercel.app";

const HOMEWORK_ROUTE = "/homework"; // adjust to wherever the enter-a-code page lives
const PURPLE_SHADOW_THEME = "0 8px 24px rgba(93, 63, 211, 0.12)";
const HEADING_FONT = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

const pctOf = (m) => (m.total_questions ? Math.round((100 * m.num_correct) / m.total_questions) : 0);

const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------- score graph (same look as the drill graph) ---------- */

// data is ordered oldest -> newest: { date, value (percent), title, score }
const WorksheetScoreGraph = ({ data, width }) => {
    const containerRef = useRef();
    const svgRef = useRef();
    const tooltipRef = useRef();

    useEffect(() => {
        if (!data.length || !width) return;

        const height = 360;
        const marginTop = 30;
        const marginRight = 20;
        const marginBottom = 55;
        const marginLeft = 55;

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");
        svg.selectAll("*").remove();

        const gradient = svg
            .append("defs")
            .append("linearGradient")
            .attr("id", "hw-area-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");
        gradient.append("stop").attr("offset", "0%").attr("stop-color", "#5D3FD3").attr("stop-opacity", 0.4);
        gradient.append("stop").attr("offset", "100%").attr("stop-color", "#5D3FD3").attr("stop-opacity", 0);

        const x = d3
            .scalePoint()
            .domain(d3.range(data.length))
            .range([marginLeft, width - marginRight])
            .padding(0.5);
        const y = d3
            .scaleLinear()
            .domain([0, 100])
            .range([height - marginBottom, marginTop]);

        const yTicks = [0, 25, 50, 75, 100];

        // grid lines
        svg
            .append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .selectAll("line")
            .data(yTicks)
            .enter()
            .append("line")
            .attr("x1", 0)
            .attr("x2", width - marginLeft - marginRight)
            .attr("y1", (d) => y(d))
            .attr("y2", (d) => y(d))
            .attr("stroke", "#F1F5F9")
            .attr("stroke-width", 1);

        // x axis: thin out the date labels when there are many attempts
        const maxLabels = Math.max(1, Math.floor((width - marginLeft - marginRight) / 70));
        const step = Math.ceil(data.length / maxLabels);
        const tickIdx = d3.range(data.length).filter((i) => i % step === 0);
        const fmt = d3.timeFormat("%b %d");

        const xAxisGroup = svg
            .append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(
                d3
                    .axisBottom(x)
                    .tickValues(tickIdx)
                    .tickFormat((i) => fmt(new Date(data[i].date)))
            );
        xAxisGroup.select(".domain").attr("stroke", "#E2E8F0");
        xAxisGroup.selectAll(".tick line").attr("stroke", "#E2E8F0");
        xAxisGroup
            .selectAll(".tick text")
            .attr("fill", "#64748B")
            .style("font-size", "11px")
            .style("font-weight", "500")
            .attr("dy", "12px");

        // y axis
        const yAxisGroup = svg
            .append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).tickValues(yTicks).tickFormat((d) => `${d}%`));
        yAxisGroup.select(".domain").attr("stroke", "none");
        yAxisGroup.selectAll(".tick line").attr("stroke", "none");
        yAxisGroup
            .selectAll(".tick text")
            .attr("fill", "#64748B")
            .style("font-size", "11px")
            .style("font-weight", "500")
            .attr("dx", "-4px");

        // axis titles
        svg
            .append("text")
            .attr("text-anchor", "middle")
            .attr("x", marginLeft + (width - marginLeft - marginRight) / 2)
            .attr("y", height - 12)
            .attr("fill", "#64748B")
            .style("font-size", "11px")
            .style("font-weight", "800")
            .style("letter-spacing", "0.06em")
            .text("ATTEMPT DATE");
        svg
            .append("text")
            .attr("text-anchor", "start")
            .attr("x", marginLeft - 45)
            .attr("y", marginTop - 15)
            .attr("fill", "#64748B")
            .style("font-size", "11px")
            .style("font-weight", "800")
            .style("letter-spacing", "0.06em")
            .text("SCORE");

        // area + line
        const area = d3
            .area()
            .x((d, i) => x(i))
            .y0(y(0))
            .y1((d) => y(d.value))
            .curve(d3.curveMonotoneX);
        svg.append("path").datum(data).attr("fill", "url(#hw-area-gradient)").attr("d", area);

        const line = d3
            .line()
            .x((d, i) => x(i))
            .y((d) => y(d.value))
            .curve(d3.curveMonotoneX);
        svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#5D3FD3")
            .attr("stroke-width", 4)
            .attr("d", line);

        // dots + tooltip
        const tooltip = d3.select(tooltipRef.current);
        const dateFmt = d3.timeFormat("%A, %b %d");

        svg
            .append("g")
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", (d, i) => x(i))
            .attr("cy", (d) => y(d.value))
            .attr("r", 6)
            .attr("fill", "#ffffff")
            .attr("stroke", "#5D3FD3")
            .attr("stroke-width", 2.5)
            .style("cursor", "pointer")
            .on("mouseover", function (event, d) {
                d3.select(this).transition().duration(150).attr("r", 8).attr("stroke-width", 3.5);
                const bounds = containerRef.current.getBoundingClientRect();
                tooltip
                    .style("opacity", 1)
                    .style("left", `${event.clientX - bounds.left}px`)
                    .style("top", `${event.clientY - bounds.top - 70}px`)
                    .html(`
            <div style="font-size: 11px; color: #64748B; font-weight: 500; margin-bottom: 2px; white-space: nowrap;">${dateFmt(new Date(d.date))}</div>
            <div style="font-size: 11px; color: #64748B; margin-bottom: 2px; white-space: nowrap;">${esc(d.title)}</div>
            <div style="color: #5D3FD3; font-weight: bold; font-size: 13px; white-space: nowrap;">Score: ${esc(d.score)} (${d.value}%)</div>
          `);
            })
            .on("mousemove", function (event) {
                const bounds = containerRef.current.getBoundingClientRect();
                tooltip
                    .style("left", `${event.clientX - bounds.left}px`)
                    .style("top", `${event.clientY - bounds.top - 70}px`);
            })
            .on("mouseleave", function () {
                d3.select(this).transition().duration(150).attr("r", 6).attr("stroke-width", 2.5);
                tooltip.style("opacity", 0);
            });
    }, [data, width]);

    return (
        <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
            <svg ref={svgRef}></svg>
            <div
                ref={tooltipRef}
                style={{
                    position: "absolute",
                    opacity: 0,
                    pointerEvents: "none",
                    backgroundColor: "rgba(255, 255, 255, 0.96)",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    transform: "translateX(-50%)",
                    transition: "opacity 0.15s ease, left 0.05s linear, top 0.05s linear",
                    zIndex: 100,
                    fontFamily: "'Lexend', sans-serif",
                }}
            ></div>
        </div>
    );
};

/* ---------- page ---------- */

const HomeWorkGroupLoggedInPerformance = () => {
    const navigate = useNavigate();
    const name = useSelector((s) => s.personDetail.name);

    const graphContainerRef = useRef();
    const [width, setWidth] = useState(600);
    const [marks, setMarks] = useState([]); // newest first, as returned by the backend
    const [homework, setHomework] = useState([]); // every available code/topic
    const [status, setStatus] = useState("loading"); // loading | ready | error
    const [gradeFilter, setGradeFilter] = useState("all");
    const [codeFilter, setCodeFilter] = useState(null);

    // Load the last 20 worksheet attempts + all codes/topics
    useEffect(() => {
        let cancelled = false;
        axios
            .get(`${API_BASE}/worksheet/get-marks`, { withCredentials: true })
            .then(({ data }) => {
                if (cancelled) return;
                setMarks(Array.isArray(data.marks) ? data.marks : []);
                setHomework(Array.isArray(data.homework) ? data.homework : []);
                setStatus("ready");
            })
            .catch((err) => {
                if (cancelled) return;
                console.error("Error loading worksheet marks:", err);
                if (err.response?.status === 401) return navigate("/login");
                setStatus("error");
            });
        return () => {
            cancelled = true;
        };
    }, [navigate]);

    const topicByCode = useMemo(() => {
        const map = new Map();
        homework.forEach((h) => map.set(h.access_code, h.topic_name));
        return map;
    }, [homework]);

    const grades = useMemo(() => {
        const set = new Set();
        homework.forEach((h) => h.grade != null && set.add(h.grade));
        marks.forEach((m) => m.grade != null && set.add(m.grade));
        return [...set].sort((a, b) => a - b);
    }, [homework, marks]);

    const matchesGrade = (g) => gradeFilter === "all" || g === gradeFilter;

    const filteredMarks = useMemo(
        () => marks.filter((m) => matchesGrade(m.grade) && (!codeFilter || m.access_code === codeFilter)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [marks, gradeFilter, codeFilter]
    );
    const filteredHomework = useMemo(
        () => homework.filter((h) => matchesGrade(h.grade)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [homework, gradeFilter]
    );

    const graphData = useMemo(
        () =>
            [...filteredMarks].reverse().map((m) => ({
                date: m.submitted_at,
                value: pctOf(m),
                title: topicByCode.get(m.access_code) || m.access_code,
                score: `${m.num_correct} / ${m.total_questions}`,
            })),
        [filteredMarks, topicByCode]
    );

    const hasData = filteredMarks.length > 0;

    // Best percentage per code, for the topic cards
    const bestByCode = useMemo(() => {
        const map = new Map();
        marks.forEach((m) => {
            const p = pctOf(m);
            if (!map.has(m.access_code) || p > map.get(m.access_code)) map.set(m.access_code, p);
        });
        return map;
    }, [marks]);

    const stats = useMemo(() => {
        const pcts = filteredMarks.map(pctOf);
        return {
            attempts: filteredMarks.length,
            best: pcts.length ? Math.max(...pcts) : 0,
            avg: pcts.length ? pcts.reduce((a, b) => a + b, 0) / pcts.length : 0,
            topicsAttempted: filteredHomework.filter((h) => bestByCode.has(h.access_code)).length,
        };
    }, [filteredMarks, filteredHomework, bestByCode]);

    // Keep the graph width in sync with its container
    useEffect(() => {
        const updateWidth = () => {
            if (graphContainerRef.current) {
                setWidth(Math.max(graphContainerRef.current.offsetWidth, 320));
            }
        };
        const t = setTimeout(updateWidth, 50);
        window.addEventListener("resize", updateWidth);
        return () => {
            clearTimeout(t);
            window.removeEventListener("resize", updateWidth);
        };
    }, [status, hasData]);

    if (status === "loading") {
        return (
            <LoggedInLayout>
                <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
                </div>
            </LoggedInLayout>
        );
    }

    return (
        <LoggedInLayout>
            <main>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold text-left" style={HEADING_FONT}>
                            {name ? `${name}'s Worksheet Performance` : "Worksheet Performance"}
                        </h1>
                        <p className="text-lg text-gray-500 mt-2">Your most recent homework worksheet scores.</p>
                    </div>

                    {status === "error" && (
                        <div
                            className="bg-white p-6 rounded-3xl border border-gray-100 text-center"
                            style={{ boxShadow: PURPLE_SHADOW_THEME }}
                            role="alert"
                        >
                            <p className="text-gray-700 font-semibold">We couldn't load your worksheet scores.</p>
                            <p className="text-sm text-gray-400 mt-1">Refresh the page to try again.</p>
                        </div>
                    )}

                    {status === "ready" && (
                        <>
                            {/* Grade filter */}
                            {grades.length > 1 && (
                                <div className="flex flex-wrap gap-3 mb-6">
                                    {[["all", "All grades"], ...grades.map((g) => [g, `Grade ${g}`])].map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setGradeFilter(key);
                                                setCodeFilter(null);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer"
                                            style={
                                                gradeFilter === key
                                                    ? { background: "#5d3fd3", color: "#fff", boxShadow: "0 4px 14px rgba(93,63,211,0.4)" }
                                                    : {
                                                        background: "#fff",
                                                        border: "1px solid #e2dfec",
                                                        color: "#484554",
                                                        boxShadow: "0 2px 6px rgba(93,63,211,0.03)",
                                                    }
                                            }
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="grid grid-cols-12 gap-6 items-stretch">
                                {/* Stat cards */}
                                {[
                                    { label: "Attempts", value: stats.attempts },
                                    { label: "Best Score", value: `${stats.best}%` },
                                    { label: "Average Score", value: `${stats.avg.toFixed(0)}%` },
                                    { label: "Topics Attempted", value: `${stats.topicsAttempted} / ${filteredHomework.length}` },
                                ].map(({ label, value }) => (
                                    <div
                                        key={label}
                                        className="col-span-6 lg:col-span-3 bg-white p-5 rounded-3xl border border-gray-100"
                                        style={{ boxShadow: PURPLE_SHADOW_THEME }}
                                    >
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                                        <p className="text-3xl font-bold text-gray-900" style={HEADING_FONT}>
                                            {value}
                                        </p>
                                    </div>
                                ))}

                                {/* Graph, or an empty state */}
                                {hasData ? (
                                    <div
                                        className="col-span-12 bg-white p-6 rounded-3xl border border-gray-100"
                                        style={{ boxShadow: PURPLE_SHADOW_THEME }}
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <h3 className="text-2xl font-bold text-gray-900" style={HEADING_FONT}>
                                                Score Over Time
                                            </h3>
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#5d3fd3" }} />
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                        Worksheet Score
                                                    </span>
                                                </div>
                                                {codeFilter && (
                                                    <button
                                                        onClick={() => setCodeFilter(null)}
                                                        className="text-xs font-bold text-purple-600 underline cursor-pointer"
                                                    >
                                                        Showing {codeFilter}. Clear
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div ref={graphContainerRef} className="w-full">
                                            <WorksheetScoreGraph data={graphData} width={width} />
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="col-span-12 bg-white p-10 rounded-3xl border border-gray-100 text-center"
                                        style={{ boxShadow: PURPLE_SHADOW_THEME }}
                                    >
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2" style={HEADING_FONT}>
                                            {marks.length === 0 ? "No worksheets yet" : "No attempts here yet"}
                                        </h3>
                                        <p className="text-gray-500 mb-5">
                                            {marks.length === 0
                                                ? "Complete your first homework worksheet and your scores will show up here."
                                                : "You haven't completed a worksheet that matches this filter."}
                                        </p>
                                        <button
                                            onClick={() => navigate(HOMEWORK_ROUTE)}
                                            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer active:scale-95 transition-all"
                                            style={{ background: "#5d3fd3", boxShadow: "0 4px 14px rgba(93,63,211,0.4)" }}
                                        >
                                            Enter a homework code
                                        </button>
                                    </div>
                                )}

                                {/* Topics covered */}
                                {filteredHomework.length > 0 && (
                                    <div
                                        className="col-span-12 bg-white p-6 rounded-3xl border border-gray-100"
                                        style={{ boxShadow: PURPLE_SHADOW_THEME }}
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-2xl font-bold text-gray-900" style={HEADING_FONT}>
                                                Worksheet Topics
                                            </h3>
                                            <span className="text-xs text-gray-400 font-medium">Select a topic to see its attempts</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {filteredHomework.map((h) => {
                                                const best = bestByCode.get(h.access_code);
                                                const attempted = best !== undefined;
                                                const active = codeFilter === h.access_code;
                                                return (
                                                    <button
                                                        key={h.access_code}
                                                        onClick={() => setCodeFilter(active ? null : h.access_code)}
                                                        className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${active
                                                                ? "border-purple-300 ring-2 ring-purple-100"
                                                                : "border-gray-100 hover:border-purple-200"
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                            <span className="text-xs font-black tracking-widest text-purple-600">
                                                                {h.access_code}
                                                            </span>
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                                Grade {h.grade}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-800 truncate">{h.topic_name}</p>
                                                        <div className="mt-3">
                                                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                                <div
                                                                    className="h-full rounded-full"
                                                                    style={{ width: `${attempted ? best : 0}%`, background: "#5d3fd3" }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {attempted ? `Best: ${best}%` : "Not attempted"}
                                                            </p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Attempts list */}
                                {hasData && (
                                    <div
                                        className="col-span-12 bg-white p-6 rounded-3xl border border-gray-100"
                                        style={{ boxShadow: PURPLE_SHADOW_THEME }}
                                    >
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4" style={HEADING_FONT}>
                                            Recent Attempts
                                        </h3>
                                        <div className="flex flex-col divide-y divide-gray-100">
                                            {filteredMarks.map((m, idx) => {
                                                const pct = pctOf(m);
                                                const when = new Date(m.submitted_at);
                                                return (
                                                    <div key={`${m.submitted_at}-${idx}`} className="flex flex-wrap items-center gap-4 py-3">
                                                        <div className="min-w-[200px] flex-1">
                                                            <p className="text-sm font-bold text-gray-800">
                                                                {topicByCode.get(m.access_code) || m.access_code}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                {m.access_code} · Grade {m.grade} ·{" "}
                                                                {when.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                                                                {" · "}
                                                                {when.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                                                            </p>
                                                        </div>

                                                        <div className="w-24 text-center">
                                                            <p className="text-lg font-bold" style={{ color: "#5d3fd3" }}>
                                                                {m.num_correct} / {m.total_questions}
                                                            </p>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Score</p>
                                                        </div>

                                                        <div className="w-32 hidden sm:block">
                                                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                                <div
                                                                    className="h-full rounded-full"
                                                                    style={{ width: `${pct}%`, background: "#5d3fd3" }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-400 mt-1 text-center">{pct}%</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </LoggedInLayout>
    );
};

export default HomeWorkGroupLoggedInPerformance;
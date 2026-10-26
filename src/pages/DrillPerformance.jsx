import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as d3 from "d3";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import LoggedInLayout from "../components/LoggedInLayout"; // adjust path

const API_BASE =
    import.meta.env.VITE_ENVIRONMENT === "DEVELOPMENT"
        ? "http://localhost:3000"
        : "https://mathamagic-backend.vercel.app";

const DRILL_ROUTE = "/drill/performance"; // adjust to wherever your drill page lives
const PURPLE_SHADOW_THEME = "0 8px 24px rgba(93, 63, 211, 0.12)";
const HEADING_FONT = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

const DRILL_LABELS = {
    "mult-2x1": "2×1 Multiplication",
    "mult-3x1": "3×1 Multiplication",
    "div-2x1": "2×1 Division",
    "div-3x1": "3×1 Division",
};

const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
};

/* ---------- score graph (same look as TrackingDottedGraph) ---------- */

// data is ordered oldest -> newest
const DrillScoreGraph = ({ data, width }) => {
    const containerRef = useRef();
    const svgRef = useRef();
    const tooltipRef = useRef();

    useEffect(() => {
        if (!data.length || !width) return;

        const height = 360;
        const marginTop = 30;
        const marginRight = 20;
        const marginBottom = 55;
        const marginLeft = 50;
        const maxScore = d3.max(data, (d) => d.total_questions) || 80;

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");
        svg.selectAll("*").remove();

        // gradient
        const gradient = svg
            .append("defs")
            .append("linearGradient")
            .attr("id", "drill-area-gradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");
        gradient.append("stop").attr("offset", "0%").attr("stop-color", "#5D3FD3").attr("stop-opacity", 0.4);
        gradient.append("stop").attr("offset", "100%").attr("stop-color", "#5D3FD3").attr("stop-opacity", 0);

        // scales
        const x = d3
            .scalePoint()
            .domain(d3.range(data.length))
            .range([marginLeft, width - marginRight])
            .padding(0.5);
        const y = d3
            .scaleLinear()
            .domain([0, maxScore])
            .range([height - marginBottom, marginTop]);

        const yTicks = d3.range(0, maxScore + 1, maxScore / 4);

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
                    .tickFormat((i) => fmt(new Date(data[i].completed_at)))
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
            .call(d3.axisLeft(y).tickValues(yTicks).tickFormat((d) => d));
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
            .attr("x", marginLeft - 40)
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
            .y1((d) => y(d.score))
            .curve(d3.curveMonotoneX);
        svg.append("path").datum(data).attr("fill", "url(#drill-area-gradient)").attr("d", area);

        const line = d3
            .line()
            .x((d, i) => x(i))
            .y((d) => y(d.score))
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
            .attr("cy", (d) => y(d.score))
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
            <div style="font-size: 11px; color: #64748B; font-weight: 500; margin-bottom: 2px; white-space: nowrap;">${dateFmt(new Date(d.completed_at))}</div>
            <div style="font-size: 11px; color: #64748B; margin-bottom: 2px; white-space: nowrap;">${DRILL_LABELS[d.drill_type] || ""}</div>
            <div style="color: #5D3FD3; font-weight: bold; font-size: 13px; white-space: nowrap;">Score: ${d.score} / ${d.total_questions}</div>
            <div style="font-size: 11px; color: #64748B; white-space: nowrap;">Time: ${formatTime(d.time_taken_seconds)}</div>
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

const DrillPerformance = () => {
    const navigate = useNavigate();
    const name = useSelector((s) => s.personDetail.name);

    const graphContainerRef = useRef();
    const [width, setWidth] = useState(600);
    const [marks, setMarks] = useState([]); // newest first, as returned by the backend
    const [status, setStatus] = useState("loading"); // loading | ready | error
    const [drillFilter, setDrillFilter] = useState("all");

    // Load the student's last 20 drill attempts
    useEffect(() => {
        let cancelled = false;
        axios
            .get(`${API_BASE}/drill/get-marks`, { withCredentials: true })
            .then(({ data }) => {
                if (cancelled) return;
                setMarks(Array.isArray(data.marks) ? data.marks : []);
                setStatus("ready");
            })
            .catch((err) => {
                if (cancelled) return;
                console.error("Error loading drill marks:", err);
                if (err.response?.status === 401) return navigate("/login");
                setStatus("error");
            });
        return () => {
            cancelled = true;
        };
    }, [navigate]);

    const filtered = useMemo(
        () => (drillFilter === "all" ? marks : marks.filter((m) => m.drill_type === drillFilter)),
        [marks, drillFilter]
    );
    const graphData = useMemo(() => [...filtered].reverse(), [filtered]); // oldest -> newest
    const hasData = filtered.length > 0;

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

    // Summary stats for whatever is currently shown
    const stats = useMemo(() => {
        if (!filtered.length) return { attempts: 0, best: 0, avg: 0, fastest: 0 };
        const scores = filtered.map((m) => m.score);
        return {
            attempts: filtered.length,
            best: Math.max(...scores),
            avg: scores.reduce((a, b) => a + b, 0) / scores.length,
            fastest: Math.min(...filtered.map((m) => m.time_taken_seconds)),
        };
    }, [filtered]);

    // Latest vs previous attempt, only meaningful within a single drill type
    const trend = useMemo(() => {
        if (drillFilter === "all" || filtered.length < 2) return null;
        const diff = filtered[0].score - filtered[1].score;
        return { isUp: diff >= 0, points: Math.abs(diff) };
    }, [filtered, drillFilter]);

    if (status === "loading") {
        return (
            <LoggedInLayout>
                <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
                </div>
            </LoggedInLayout>
        );
    }

    const filterOptions = [["all", "All drills"], ...Object.entries(DRILL_LABELS)];

    return (
        <LoggedInLayout>
            <main>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold text-left" style={HEADING_FONT}>
                            {name ? `${name}'s Drill Performance` : "Drill Performance"}
                        </h1>
                        <p className="text-lg text-gray-500 mt-2">Your most recent arithmetic drill scores.</p>
                    </div>

                    {status === "error" && (
                        <div
                            className="bg-white p-6 rounded-3xl border border-gray-100 text-center"
                            style={{ boxShadow: PURPLE_SHADOW_THEME }}
                            role="alert"
                        >
                            <p className="text-gray-700 font-semibold">We couldn't load your drill scores.</p>
                            <p className="text-sm text-gray-400 mt-1">Refresh the page to try again.</p>
                        </div>
                    )}

                    {status === "ready" && marks.length === 0 && (
                        <div
                            className="bg-white p-10 rounded-3xl border border-gray-100 text-center"
                            style={{ boxShadow: PURPLE_SHADOW_THEME }}
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-2" style={HEADING_FONT}>
                                No drills yet
                            </h3>
                            <p className="text-gray-500 mb-5">Complete your first arithmetic drill and your scores will show up here.</p>
                            <button
                                onClick={() => navigate(DRILL_ROUTE)}
                                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer active:scale-95 transition-all"
                                style={{ background: "#5d3fd3", boxShadow: "0 4px 14px rgba(93,63,211,0.4)" }}
                            >
                                Start a drill
                            </button>
                        </div>
                    )}

                    {status === "ready" && marks.length > 0 && (
                        <>
                            {/* Drill type filter */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                {filterOptions.map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => setDrillFilter(key)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer"
                                        style={
                                            drillFilter === key
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

                            {!hasData ? (
                                <div
                                    className="bg-white p-8 rounded-3xl border border-gray-100 text-center text-gray-500"
                                    style={{ boxShadow: PURPLE_SHADOW_THEME }}
                                >
                                    No attempts for this drill type yet.
                                </div>
                            ) : (
                                <div className="grid grid-cols-12 gap-6 items-stretch">
                                    {/* Stat cards */}
                                    {[
                                        { label: "Attempts", value: stats.attempts },
                                        { label: "Best Score", value: `${stats.best} / 80` },
                                        { label: "Average Score", value: stats.avg.toFixed(1) },
                                        { label: "Fastest Time", value: formatTime(stats.fastest) },
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

                                    {/* Score graph */}
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
                                                        Drill Score
                                                    </span>
                                                </div>
                                                {trend && (
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <div
                                                            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold"
                                                            style={{
                                                                color: trend.isUp ? "#38A169" : "#E53E3E",
                                                                backgroundColor: trend.isUp ? "#F0FDF4" : "#FFF5F5",
                                                            }}
                                                        >
                                                            {trend.isUp ? <TrendingUpIcon size={12} /> : <TrendingDownIcon size={12} />}
                                                            <span>{trend.points} pts</span>
                                                        </div>
                                                        <span className="text-xs text-gray-400 font-medium">vs previous drill</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div ref={graphContainerRef} className="w-full">
                                            <DrillScoreGraph data={graphData} width={width} />
                                        </div>
                                    </div>

                                    {/* Attempts list */}
                                    <div
                                        className="col-span-12 bg-white p-6 rounded-3xl border border-gray-100"
                                        style={{ boxShadow: PURPLE_SHADOW_THEME }}
                                    >
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4" style={HEADING_FONT}>
                                            Recent Attempts
                                        </h3>
                                        <div className="flex flex-col divide-y divide-gray-100">
                                            {filtered.map((m, idx) => {
                                                const pct = Math.round((100 * m.score) / m.total_questions);
                                                const when = new Date(m.completed_at);
                                                return (
                                                    <div key={`${m.completed_at}-${idx}`} className="flex flex-wrap items-center gap-4 py-3">
                                                        <div className="min-w-[170px] flex-1">
                                                            <p className="text-sm font-bold text-gray-800">
                                                                {DRILL_LABELS[m.drill_type] || m.drill_type}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                {when.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                                                                {" · "}
                                                                {when.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                                                            </p>
                                                        </div>

                                                        <div className="w-24 text-center">
                                                            <p className="text-lg font-bold" style={{ color: "#5d3fd3" }}>
                                                                {m.score} / {m.total_questions}
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

                                                        <div className="w-20 text-center">
                                                            <p className="text-lg font-bold text-gray-800">{formatTime(m.time_taken_seconds)}</p>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </LoggedInLayout>
    );
};

export default DrillPerformance;
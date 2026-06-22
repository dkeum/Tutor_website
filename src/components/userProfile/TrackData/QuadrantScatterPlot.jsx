import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

const QuadrantScatterPlot = ({ topics = [], width = 600, filterType = "month" }) => {
  const d3Ref = useRef();
  const height = 480; // ← taller

  const badgeMap = {
    week:  "This Week",
    month: "This Month",
    year:  "This Year",
  };

  useEffect(() => {
    if (!d3Ref.current || !width || !topics.length) return;

    d3.select(d3Ref.current).selectAll("*").remove();

    const margin = { top: 50, right: 60, bottom: 65, left: 70 };
    const plotWidth  = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const svg = d3.select(d3Ref.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // ─── Scales ───────────────────────────────────────────────────────────────
    // X: effort hours — use actual data range with padding so dots never hit edges
    const maxTime = d3.max(topics, (d) => d.timeSpent) || 1;
    const xPad    = maxTime * 0.2;
    const xScale  = d3.scaleLinear()
      .domain([0, maxTime + xPad])
      .range([0, plotWidth]);

    // Y: grade — fixed 50–105 so there's breathing room above 100
    const yScale = d3.scaleLinear()
      .domain([50, 105])
      .range([plotHeight, 0]);

    const midX = xScale((maxTime + xPad) / 2);
    const midY = yScale(77.5);

    // ─── Quadrant background fills ────────────────────────────────────────────
    const quadrantFills = [
      { x: 0,    y: 0,    w: midX,            h: midY,             fill: "#f9f7ff" }, // top-left
      { x: midX, y: 0,    w: plotWidth - midX, h: midY,             fill: "#f0fdf4" }, // top-right
      { x: 0,    y: midY, w: midX,            h: plotHeight - midY, fill: "#fff5f5" }, // bottom-left
      { x: midX, y: midY, w: plotWidth - midX, h: plotHeight - midY, fill: "#fffbeb" }, // bottom-right
    ];

    quadrantFills.forEach((q) => {
      svg.append("rect")
        .attr("x", q.x).attr("y", q.y)
        .attr("width", q.w).attr("height", q.h)
        .attr("fill", q.fill)
        .attr("rx", 0);
    });

    // ─── Divider lines ────────────────────────────────────────────────────────
    svg.append("line")
      .attr("x1", midX).attr("y1", 0)
      .attr("x2", midX).attr("y2", plotHeight)
      .attr("stroke", "#e2e8f0").attr("stroke-width", 1.5).attr("stroke-dasharray", "4,3");

    svg.append("line")
      .attr("x1", 0).attr("y1", midY)
      .attr("x2", plotWidth).attr("y2", midY)
      .attr("stroke", "#e2e8f0").attr("stroke-width", 1.5).attr("stroke-dasharray", "4,3");

    // ─── Quadrant labels ──────────────────────────────────────────────────────
    const quadrantLabels = [
      { x: 12,            y: 16,             label: "DOING GREAT!",    anchor: "start", color: "#a78bfa" },
      { x: plotWidth - 12, y: 16,            label: "HIGH EFFICIENCY", anchor: "end",   color: "#34d399" },
      { x: 12,            y: plotHeight - 12, label: "NEEDS HELP",     anchor: "start", color: "#f87171" },
      { x: plotWidth - 12, y: plotHeight - 12, label: "JUST STARTING", anchor: "end",   color: "#fbbf24" },
    ];

    quadrantLabels.forEach((q) => {
      svg.append("text")
        .attr("x", q.x).attr("y", q.y)
        .attr("text-anchor", q.anchor)
        .attr("fill", q.color)
        .style("font-size", "9.5px")
        .style("font-weight", "800")
        .style("letter-spacing", "0.07em")
        .text(q.label);
    });

    // ─── Axes ─────────────────────────────────────────────────────────────────
    const xAxis = d3.axisBottom(xScale).ticks(5).tickSize(-plotHeight).tickPadding(12);
    const yAxis = d3.axisLeft(yScale).ticks(6).tickSize(-plotWidth).tickPadding(12)
      .tickFormat((d) => `${d}%`);

    const xAxisG = svg.append("g")
      .attr("transform", `translate(0,${plotHeight})`)
      .call(xAxis);
    xAxisG.select(".domain").remove();
    xAxisG.selectAll(".tick line")
      .attr("stroke", "#f1f5f9").attr("stroke-width", 1);
    xAxisG.selectAll("text")
      .attr("fill", "#94a3b8").style("font-size", "11px");

    const yAxisG = svg.append("g").call(yAxis);
    yAxisG.select(".domain").remove();
    yAxisG.selectAll(".tick line")
      .attr("stroke", "#f1f5f9").attr("stroke-width", 1);
    yAxisG.selectAll("text")
      .attr("fill", "#94a3b8").style("font-size", "11px");

    // Axis titles
    svg.append("text")
      .attr("x", plotWidth / 2).attr("y", plotHeight + 50)
      .attr("text-anchor", "middle")
      .style("font-size", "10px").style("font-weight", "700")
      .style("letter-spacing", "0.08em")
      .attr("fill", "#94a3b8").text("EFFORT (HOURS)");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -plotHeight / 2).attr("y", -52)
      .attr("text-anchor", "middle")
      .style("font-size", "10px").style("font-weight", "700")
      .style("letter-spacing", "0.08em")
      .attr("fill", "#94a3b8").text("GRADE (%)");

    // ─── Dots ─────────────────────────────────────────────────────────────────
    const dotGroups = svg.selectAll(".topic-dot")
      .data(topics)
      .enter()
      .append("g")
      .attr("class", "topic-dot")
      .attr("transform", (d) => `translate(${xScale(d.timeSpent ?? 0)},${yScale(Math.min(d.numericGrade, 100))})`);

    // Outer glow ring
    dotGroups.append("circle")
      .attr("r", 14)
      .attr("fill", (d) => d.color || "#5D3FD3")
      .attr("opacity", 0.12);

    // Main dot
    dotGroups.append("circle")
      .attr("r", 8)
      .attr("fill", (d) => d.color || "#5D3FD3")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer");

    // Grade label inside dot
    dotGroups.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "7px")
      .style("font-weight", "800")
      .attr("fill", "#fff")
      .text((d) => d.grade);

    // Topic name above dot
    dotGroups.append("text")
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "700")
      .attr("fill", "#1e293b")
      .text((d) => d.title.length > 18 ? d.title.slice(0, 16) + "…" : d.title);

  }, [width, topics]);

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col relative select-none">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 leading-snug">
            Grades vs Effort Analysis
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Performance correlation based on study hours
          </p>
        </div>
        <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full whitespace-nowrap">
          {badgeMap[filterType] || "This Month"}
        </span>
      </div>
      <div className="w-full overflow-x-auto">
        <svg ref={d3Ref} className="mx-auto block" />
      </div>
    </div>
  );
};

QuadrantScatterPlot.propTypes = {
  width:      PropTypes.number,
  filterType: PropTypes.string,
  topics:     PropTypes.arrayOf(
    PropTypes.shape({
      title:        PropTypes.string.isRequired,
      numericGrade: PropTypes.number.isRequired,
      timeSpent:    PropTypes.number.isRequired,
      color:        PropTypes.string,
      grade:        PropTypes.string,
    })
  ).isRequired,
};

export default QuadrantScatterPlot;
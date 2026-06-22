import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const TrackingLoggedInActivtiy_Progress = ({ width, filterType, timeLogs = [], targetHours = 15 }) => {
  const containerRef = useRef();
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    if (!width) return;

    const height = 420;
    const marginTop = 30;
    const marginRight = 20;
    const marginBottom = 65;
    const marginLeft = 60;

    // ─── Use real data or fall back to empty if nothing yet ──────────────
    // timeLogs shape from backend: { date: string, durationHours: number }
    const sourceData = timeLogs.length > 0 ? timeLogs : [];

    const latestDateInData = sourceData.length
      ? new Date(d3.max(sourceData, (d) => new Date(d.date)))
      : new Date();

    let start, end;
    let axisContextLabel = "Study Hours Goal Tracker";
    let targetGoalValue;

    if (filterType === "week") {
      end = new Date(latestDateInData);
      start = new Date(latestDateInData);
      start.setDate(end.getDate() - 6);
      axisContextLabel = "Hours Logged This Week";
      targetGoalValue = targetHours / 7;        // daily target
    } else if (filterType === "month") {
      end = new Date(latestDateInData);
      start = new Date(latestDateInData);
      start.setDate(end.getDate() - 27);
      axisContextLabel = "Weekly Commitment Tracker (Past Month)";
      targetGoalValue = targetHours;            // weekly target
    } else if (filterType === "year") {
      start = new Date(latestDateInData.getFullYear(), 0, 1);
      end = new Date(latestDateInData.getFullYear(), 11, 31);
      axisContextLabel = "Monthly Commitment Tracker (This Year)";
      targetGoalValue = (52 / 12) * targetHours; // monthly target
    }

    const utcStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
    const utcEnd   = new Date(Date.UTC(end.getUTCFullYear(),   end.getUTCMonth(),   end.getUTCDate()));

    // ─── Group key by filter type ─────────────────────────────────────────
    function getGroupKey(date) {
      if (filterType === "week") {
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
      } else if (filterType === "month") {
        const diffDays = Math.floor(Math.abs(date - utcStart) / (1000 * 60 * 60 * 24));
        return `Week ${Math.min(Math.floor(diffDays / 7), 3) + 1}`;
      } else {
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
      }
    }

    // ─── Build date intervals ─────────────────────────────────────────────
    let dateIntervals = [];
    if (filterType === "week") {
      let curr = new Date(utcStart);
      while (curr <= utcEnd) {
        dateIntervals.push({ date: new Date(curr), label: d3.timeFormat("%d")(curr), key: getGroupKey(curr) });
        curr.setUTCDate(curr.getUTCDate() + 1);
      }
    } else if (filterType === "month") {
      for (let i = 0; i < 4; i++) {
        const d = new Date(utcStart);
        d.setUTCDate(d.getUTCDate() + i * 7);
        dateIntervals.push({ date: d, label: `Wk ${i + 1}`, key: `Week ${i + 1}` });
      }
    } else {
      for (let m = 0; m < 12; m++) {
        const d = new Date(Date.UTC(utcStart.getUTCFullYear(), m, 1));
        dateIntervals.push({
          date:  d,
          label: d3.timeFormat("%b")(d),
          key:   `${d.getUTCFullYear()}-${String(m + 1).padStart(2, "0")}`,
        });
      }
    }

    // ─── Aggregate real timeLogs into the intervals ───────────────────────
    const aggregateMap = {};
    dateIntervals.forEach((node) => { aggregateMap[node.key] = 0; });

    sourceData.forEach((log) => {
      const logDate = new Date(log.date);
      if (logDate >= start && logDate <= end) {
        const key = getGroupKey(logDate);
        if (aggregateMap[key] !== undefined) {
          aggregateMap[key] += log.durationHours; // durationHours from backend
        }
      }
    });

    const parsedData = dateIntervals.map((node) => ({
      date:         node.date,
      displayLabel: node.label,
      value:        aggregateMap[node.key],
    }));

    // ─── Dynamic Y scale ──────────────────────────────────────────────────
    const maxLoggedValue = d3.max(parsedData, (d) => d.value) || 0;
    const yMaxDomain = Math.max(maxLoggedValue, targetGoalValue) * 1.25;

    // ─── SVG setup ────────────────────────────────────────────────────────
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.selectAll("*").remove();

    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "hours-area-gradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#6366F1").attr("stop-opacity", 0.4);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#6366F1").attr("stop-opacity", 0);

    const x = d3
      .scalePoint()
      .domain(parsedData.map((d) => d.displayLabel))
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, yMaxDomain])
      .nice()
      .range([height - marginBottom, marginTop]);

    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x))
      .attr("color", "#E2E8F0")
      .selectAll("text")
      .attr("fill", "#718096")
      .style("font-weight", "500")
      .style("font-size", "11px");

    if (filterType === "week") {
      svg.selectAll(".tick").each(function (_, index) {
        const node = parsedData[index];
        if (node) {
          d3.select(this)
            .append("text")
            .attr("fill", "#718096")
            .attr("y", 26).attr("x", 0).attr("dy", "0.71em")
            .style("font-size", "11px").style("opacity", 0.7)
            .text(d3.timeFormat("%a")(node.date));
        }
      });
    }

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", marginLeft + (width - marginLeft - marginRight) / 2)
      .attr("y", height - 8)
      .attr("fill", "#718096")
      .style("font-size", "13px").style("font-weight", "600")
      .text(axisContextLabel);

    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `${d.toFixed(1)}h`))
      .attr("color", "#E2E8F0")
      .selectAll("text")
      .attr("fill", "#718096").style("font-weight", "500");

    svg.append("text")
      .attr("text-anchor", "start")
      .attr("x", marginLeft - 50).attr("y", marginTop - 15)
      .attr("fill", "#4A5568")
      .style("font-size", "14px").style("font-weight", "600")
      .text("Time (Hours)");

    // Goal line
    svg.append("line")
      .attr("x1", marginLeft).attr("y1", y(targetGoalValue))
      .attr("x2", width - marginRight).attr("y2", y(targetGoalValue))
      .attr("stroke", "#94A3B8").attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");

    const area = d3.area()
      .x((d) => x(d.displayLabel))
      .y0(y(0)).y1((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(parsedData)
      .attr("fill", "url(#hours-area-gradient)")
      .attr("d", area);

    const line = d3.line()
      .x((d) => x(d.displayLabel))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", "#6366F1")
      .attr("stroke-width", 4)
      .attr("d", line);

    const tooltip = d3.select(tooltipRef.current);

    svg.append("g")
      .selectAll("circle")
      .data(parsedData)
      .join("circle")
      .attr("cx", (d) => x(d.displayLabel))
      .attr("cy", (d) => y(d.value))
      .attr("r", 6)
      .attr("fill", "#ffffff")
      .attr("stroke", "#6366F1")
      .attr("stroke-width", 2.5)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(150).attr("r", 8).attr("stroke-width", 3.5);
        const bounds = containerRef.current.getBoundingClientRect();
        tooltip
          .style("opacity", 1)
          .style("left", `${event.clientX - bounds.left}px`)
          .style("top",  `${event.clientY - bounds.top - 55}px`)
          .html(`
            <div style="font-weight:600;margin-bottom:2px;white-space:nowrap;">
              ${filterType === "month" ? d.displayLabel : d3.timeFormat(filterType === "year" ? "%B %Y" : "%A, %b %d")(d.date)}
            </div>
            <div style="color:#6366F1;font-weight:bold;">Logged: ${d.value.toFixed(2)} hrs</div>
            <div style="color:#475569;font-size:11px;margin-top:2px;">Target: ${targetGoalValue.toFixed(2)} hrs</div>
          `);
      })
      .on("mousemove", function (event) {
        const bounds = containerRef.current.getBoundingClientRect();
        tooltip
          .style("left", `${event.clientX - bounds.left}px`)
          .style("top",  `${event.clientY - bounds.top - 55}px`);
      })
      .on("mouseleave", function () {
        d3.select(this).transition().duration(150).attr("r", 6).attr("stroke-width", 2.5);
        tooltip.style("opacity", 0);
      });

  }, [width, filterType, timeLogs, targetHours]); // ← timeLogs + targetHours in deps

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        style={{
          position: "absolute", opacity: 0, pointerEvents: "none",
          backgroundColor: "rgba(255,255,255,0.96)",
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: "8px", padding: "8px 12px",
          fontSize: "14px", color: "#1A202C",
          transform: "translateX(-50%)",
          transition: "opacity 0.15s ease, left 0.05s linear, top 0.05s linear",
          zIndex: 100,
        }}
      />
    </div>
  );
};

export default TrackingLoggedInActivtiy_Progress;
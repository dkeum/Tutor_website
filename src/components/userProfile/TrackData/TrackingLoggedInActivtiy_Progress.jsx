import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

// Sample mock tracking dataset representing raw student activity timestamps and hours logged
const hours_mock_data = [
  { date: "2025-08-01T10:00:00Z", hours: 1.2 },
  { date: "2025-08-02T10:00:00Z", hours: 0.5 },
  { date: "2025-08-04T10:00:00Z", hours: 2.1 },
  { date: "2025-08-07T10:00:00Z", hours: 1.8 },
  { date: "2025-08-10T10:00:00Z", hours: 0.8 },
  { date: "2025-08-12T10:00:00Z", hours: 1.5 },
  { date: "2025-09-01T10:00:00Z", hours: 1.0 },
  { date: "2025-09-03T10:00:00Z", hours: 2.5 },
  { date: "2025-09-05T10:00:00Z", hours: 0.4 },
  { date: "2025-09-08T10:00:00Z", hours: 3.0 },
  { date: "2025-09-11T10:00:00Z", hours: 1.2 },
  { date: "2025-09-14T10:00:00Z", hours: 0.9 },
];

const TrackingLoggedInActivtiy_Progress = ({ width, filterType }) => {
  const containerRef = useRef();
  const svgRef = useRef();
  const tooltipRef = useRef();

  // Baseline constant: Student goal is 5 hours per week
  const WEEKLY_GOAL_HOURS = 5.0;

  useEffect(() => {
    if (!width) return;

    const height = 420;
    const marginTop = 30;
    const marginRight = 20;
    const marginBottom = 65;
    const marginLeft = 60;

    // Use latest mock tracking date anchor point
    const latestDateInData = new Date(d3.max(hours_mock_data, (d) => new Date(d.date)) || "2025-09-14T10:00:00Z");

    let start, end;
    let axisContextLabel = "Study Hours Goal Tracker";
    let targetGoalValue = WEEKLY_GOAL_HOURS; // Dynamic metric threshold line value

    // ─── DYNAMIC METRIC INTERVAL CONFIGURATION ──────────────────────────
    if (filterType === "week") {
      end = new Date(latestDateInData);
      start = new Date(latestDateInData);
      start.setDate(end.getDate() - 6);
      axisContextLabel = "Hours Logged This Week";
      // Daily target metric calculation baseline (5 hours / 7 days)
      targetGoalValue = WEEKLY_GOAL_HOURS / 7;
    } else if (filterType === "month") {
      // Look back exactly 4 weeks to match a cleanly parsed 28-day study graph window
      end = new Date(latestDateInData);
      start = new Date(latestDateInData);
      start.setDate(end.getDate() - 27);
      axisContextLabel = "Weekly Commitment Tracker (Past Month)";
      targetGoalValue = WEEKLY_GOAL_HOURS; 
    } else if (filterType === "year") {
      start = new Date(latestDateInData.getFullYear(), 0, 1);
      end = new Date(latestDateInData.getFullYear(), 11, 31);
      axisContextLabel = "Monthly Commitment Tracker (This Year)";
      // Monthly target scaling calculation (52 weeks / 12 months * 5 hours)
      targetGoalValue = (52 / 12) * WEEKLY_GOAL_HOURS;
    }

    const utcStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
    const utcEnd = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));

    // ─── AGGREGATION ENGINE PARSING ─────────────────────────────────────
    function getGroupKey(date) {
      if (filterType === "week") {
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
      } else if (filterType === "month") {
        // Segment into 4 distinct calendar blocks index strings
        const diffTime = Math.abs(date - utcStart);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const weekIndex = Math.min(Math.floor(diffDays / 7), 3);
        return `Week ${weekIndex + 1}`;
      } else {
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
      }
    }

    // Generate intervals for structural mapping
    let dateIntervals = [];
    if (filterType === "week") {
      let curr = new Date(utcStart);
      while (curr <= utcEnd) {
        dateIntervals.push({ date: new Date(curr), label: d3.timeFormat("%d")(curr), key: getGroupKey(curr) });
        curr.setUTCDate(curr.getUTCDate() + 1);
      }
    } else if (filterType === "month") {
      // Establish 4 structural weekly increments nodes
      for (let i = 0; i < 4; i++) {
        const d = new Date(utcStart);
        d.setUTCDate(d.getUTCDate() + (i * 7));
        dateIntervals.push({ date: d, label: `Wk ${i + 1}`, key: `Week ${i + 1}` });
      }
    } else {
      for (let m = 0; m < 12; m++) {
        const d = new Date(Date.UTC(utcStart.getUTCFullYear(), m, 1));
        dateIntervals.push({ date: d, label: d3.timeFormat("%b")(d), key: `${d.getUTCFullYear()}-${String(m + 1).padStart(2, "0")}` });
      }
    }

    // Initialize mapping hash table
    const aggregateMap = {};
    dateIntervals.forEach(node => { aggregateMap[node.key] = 0; });

    // Populate actual tracking values from mock data store
    hours_mock_data.forEach(d => {
      const targetDate = new Date(d.date);
      if (targetDate >= start && targetDate <= end) {
        const key = getGroupKey(targetDate);
        if (aggregateMap[key] !== undefined) {
          aggregateMap[key] += d.hours;
        }
      }
    });

    const parsedData = dateIntervals.map(node => ({
      date: node.date,
      displayLabel: node.label,
      value: aggregateMap[node.key]
    }));

    // ─── DYNAMIC SCALE DOMAIN CALCULATION ───────────────────────────────
    // Read max value and verify against goal line threshold to protect rendering caps
    const maxLoggedValue = d3.max(parsedData, d => d.value) || 0;
    const yMaxDomain = Math.max(maxLoggedValue, targetGoalValue) * 1.25;

    // --- SVG Base Shell Engine Configuration ---
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.selectAll("*").remove();

    // --- Indigo Gradient Base Mapping Definitions ---
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "hours-area-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#6366F1").attr("stop-opacity", 0.4);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#6366F1").attr("stop-opacity", 0);

    // --- Axis Linear Scale Transformations ---
    const x = d3
      .scalePoint()
      .domain(parsedData.map(d => d.displayLabel))
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, yMaxDomain])
      .nice()
      .range([height - marginBottom, marginTop]);

    // --- X Axis Generation Rendering Layout ---
    const xAxis = d3.axisBottom(x);
    const xAxisGroup = svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis)
      .attr("color", "#E2E8F0")
      .selectAll("text")
      .attr("fill", "#718096")
      .style("font-weight", "500")
      .style("font-size", "11px");

    // Append day tags if looking at weekly metrics
    if (filterType === "week") {
      svg.selectAll(".tick").each(function(_, index) {
        const targetNode = parsedData[index];
        if (targetNode) {
          d3.select(this)
            .append("text")
            .attr("fill", "#718096")
            .attr("y", 26)
            .attr("x", 0)
            .attr("dy", "0.71em")
            .style("font-size", "11px")
            .style("opacity", 0.7)
            .text(d3.timeFormat("%a")(targetNode.date));
        }
      });
    }

    // Context Section Marker Title
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", marginLeft + (width - marginLeft - marginRight) / 2)
      .attr("y", height - 8)
      .attr("fill", "#718096")
      .style("font-size", "13px")
      .style("font-weight", "600")
      .text(axisContextLabel);

    // --- Y Axis Rendering Engine Configuration ---
    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d.toFixed(1)}h`))
      .attr("color", "#E2E8F0")
      .selectAll("text")
      .attr("fill", "#718096")
      .style("font-weight", "500");

    // Y Axis Title Label Token
    svg.append("text")
      .attr("text-anchor", "start")
      .attr("x", marginLeft - 50)
      .attr("y", marginTop - 15)
      .attr("fill", "#4A5568")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .text("Time (Hours)");

    // ─── GOAL LINE GENERATION ENGINE ────────────────────────────────────
    // Render horizontal baseline reference rule tracking standard performance parameters
    svg.append("line")
      .attr("x1", marginLeft)
      .attr("y1", y(targetGoalValue))
      .attr("x2", width - marginRight)
      .attr("y2", y(targetGoalValue))
      .attr("stroke", "#94A3B8")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");

    // ─── VISUAL DATA LINE ENGINE CHARTS ─────────────────────────────────
    const area = d3
      .area()
      .x(d => x(d.displayLabel))
      .y0(y(0))
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(parsedData)
      .attr("fill", "url(#hours-area-gradient)")
      .attr("d", area);

    const line = d3
      .line()
      .x(d => x(d.displayLabel))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", "#6366F1")
      .attr("stroke-width", 4)
      .attr("d", line);

    // --- Interactive Hover Handling Tooltips Engine ---
    const tooltip = d3.select(tooltipRef.current);
    const dateTitleFormatter = filterType === "year" ? d3.timeFormat("%B %Y") : d3.timeFormat("%A, %b %d");

    const dots = svg
      .append("g")
      .selectAll("circle")
      .data(parsedData)
      .join("circle")
      .attr("cx", d => x(d.displayLabel))
      .attr("cy", d => y(d.value))
      .attr("r", 6)
      .attr("fill", "#ffffff")
      .attr("stroke", "#6366F1")
      .attr("stroke-width", 2.5)
      .style("cursor", "pointer");

    dots
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("r", 8)
          .attr("stroke-width", 3.5);

        const containerBounds = containerRef.current.getBoundingClientRect();
        const mouseX = event.clientX - containerBounds.left;
        const mouseY = event.clientY - containerBounds.top;

        // Formulate relative contextual text strings based on temporal metrics context
        let dateHeaderString = dateTitleFormatter(d.date);
        if (filterType === "month") {
          dateHeaderString = d.displayLabel;
        }

        tooltip
          .style("opacity", 1)
          .style("left", `${mouseX}px`)
          .style("top", `${mouseY - 55}px`)
          .html(`
            <div style="font-weight: 600; margin-bottom: 2px; white-space: nowrap;">${dateHeaderString}</div>
            <div style="color: #6366F1; font-weight: bold;">Logged: ${d.value.toFixed(2)} hrs</div>
            <div style="color: #475569; font-size: 11px; margin-top: 2px;">Target: ${targetGoalValue.toFixed(2)} hrs</div>
          `);
      })
      .on("mousemove", function (event) {
        const containerBounds = containerRef.current.getBoundingClientRect();
        const mouseX = event.clientX - containerBounds.left;
        const mouseY = event.clientY - containerBounds.top;

        tooltip
          .style("left", `${mouseX}px`)
          .style("top", `${mouseY - 55}px`);
      })
      .on("mouseleave", function () {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("r", 6)
          .attr("stroke-width", 2.5);

        tooltip.style("opacity", 0);
      });

  }, [width, filterType]);

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
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          borderRadius: "8px",
          padding: "8px 12px",
          fontSize: "14px",
          color: "#1A202C",
          transform: "translateX(-50%)",
          transition: "opacity 0.15s ease, left 0.05s linear, top 0.05s linear",
          zIndex: 100,
        }}
      ></div>
    </div>
  );
};

export default TrackingLoggedInActivtiy_Progress;
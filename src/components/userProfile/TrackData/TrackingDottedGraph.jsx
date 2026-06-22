import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const TrackingDottedGraph = ({ data, width, filterType }) => {
  const containerRef = useRef();
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    if (!data || !width) return;

    // Increased height and bottom margin slightly to give extra breathing room for the double label setup
    const height = 420;
    const marginTop = 30; 
    const marginRight = 20;
    const marginBottom = 65; // Pushed out from 50 to accommodate day tags + baseline label
    const marginLeft = 60;   

    const latestDateInData = data.length
      ? new Date(d3.max(data, (d) => new Date(d.date)))
      : new Date();

    let start, end, unit = "day";
    let axisContextLabel = "This Week";

    if (filterType === "week") {
      end = new Date(latestDateInData);
      start = new Date(latestDateInData);
      start.setDate(end.getDate() - 6);
      axisContextLabel = "This Week";
    } else if (filterType === "month") {
      start = new Date(latestDateInData.getFullYear(), latestDateInData.getMonth(), 1);
      end = new Date(latestDateInData.getFullYear(), latestDateInData.getMonth() + 1, 0);
      axisContextLabel = "This Month";
    } else if (filterType === "year") {
      start = new Date(latestDateInData.getFullYear(), 0, 1);
      end = new Date(latestDateInData.getFullYear(), 11, 31);
      unit = "month";
      axisContextLabel = "This Year";
    }

    const utcStart = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
    const utcEnd = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));

    function toUTCDateKey(date) {
      if (unit === "day") {
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
      } else {
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
      }
    }

    function generateDateRange(start, end, unit) {
      const range = [];
      let current = new Date(start);
      while (current <= end) {
        range.push(new Date(current));
        if (unit === "day") current.setUTCDate(current.getUTCDate() + 1);
        else current.setUTCMonth(current.getUTCMonth() + 1);
      }
      return range;
    }

    const dateRange = generateDateRange(utcStart, utcEnd, unit);

    const dataMap = {};
    data.forEach((d) => {
      const key = toUTCDateKey(new Date(d.date));
      if (!dataMap[key]) dataMap[key] = [];
      const numericGrade = parseFloat(d.grade);
      dataMap[key].push(isNaN(numericGrade) ? 0 : numericGrade);
    });

    const parsedData = dateRange.map((date) => {
      const key = toUTCDateKey(date);
      const grades = dataMap[key] || [];
      const avg = grades.length ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
      return { date, value: avg, hasData: grades.length > 0 };
    });

    // --- SVG setup ---
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.selectAll("*").remove();

    // --- Gradient definition ---
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#5D3FD3")
      .attr("stop-opacity", 0.4);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#5D3FD3")
      .attr("stop-opacity", 0);

    // --- Scales ---
    const x = d3
      .scaleUtc()
      .domain(d3.extent(parsedData, (d) => d.date))
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, 100])
      .nice()
      .range([height - marginBottom, marginTop]);

    // --- Axes ---
    const xAxis =
      filterType === "year"
        ? d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%b"))
        : d3.axisBottom(x).ticks(d3.timeDay.every(1)).tickFormat(d3.timeFormat("%d"));

    const xAxisGroup = svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

    // Match slate gray axis styling
    xAxisGroup.select(".domain").attr("stroke", "#E2E8F0");
    xAxisGroup.selectAll(".tick line").attr("stroke", "#E2E8F0");
    xAxisGroup.selectAll(".tick text")
      .attr("fill", "#64748B")
      .style("font-size", "11px")
      .style("font-weight", "500")
      .attr("dy", "12px");

    if (filterType === "week") {
      xAxisGroup.selectAll(".tick").each(function(d) {
        d3.select(this)
          .append("text")
          .attr("fill", "#94A3B8")
          .attr("y", 26) 
          .attr("x", 0)
          .attr("dy", "0.71em")
          .style("font-size", "10px")
          .style("font-weight", "500")
          .text(d3.timeFormat("%a")(d));
      });
    }

    // --- Y Axis ---
    const yAxisGroup = svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `${d}%`));

    yAxisGroup.select(".domain").attr("stroke", "none");
    yAxisGroup.selectAll(".tick line").attr("stroke", "none");
    yAxisGroup.selectAll(".tick text")
      .attr("fill", "#64748B")
      .style("font-size", "11px")
      .style("font-weight", "500")
      .attr("dx", "-4px");

    // --- Grid Lines ---
    svg.append("g")
      .attr("class", "grid-lines")
      .attr("transform", `translate(${marginLeft},0)`)
      .selectAll("line")
      .data(y.ticks(5))
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", width - marginLeft - marginRight)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", "#F1F5F9")
      .attr("stroke-width", 1);

    // ─── Repositioned & Bold Context Timeline Label ──────────────────────────────────────
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", marginLeft + (width - marginLeft - marginRight) / 2)
      .attr("y", height - 12)
      .attr("fill", "#64748B") // Stepped up contrast slightly for bold presentation
      .style("font-size", "11px")
      .style("font-weight", "800") // Made bold
      .style("letter-spacing", "0.06em")
      .text(axisContextLabel.toUpperCase());

    // Left Y Axis Title Marker — Bold
    svg.append("text")
      .attr("text-anchor", "start")
      .attr("x", marginLeft - 50) 
      .attr("y", marginTop - 15)
      .attr("fill", "#64748B")
      .style("font-size", "11px")
      .style("font-weight", "800") // Made bold
      .style("letter-spacing", "0.06em")
      .text("GRADE");

    // --- Area Line paths ---
    const area = d3
      .area()
      .x((d) => x(d.date))
      .y0(y(0))
      .y1((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(parsedData)
      .attr("fill", "url(#area-gradient)")
      .attr("d", area);

    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", "#5D3FD3")
      .attr("stroke-width", 4) 
      .attr("d", line);

    // --- Tooltip Selection ---
    const tooltip = d3.select(tooltipRef.current);
    const dateFormatter = filterType === "year" ? d3.timeFormat("%B %Y") : d3.timeFormat("%A, %b %d");

    // --- Dots ---
    const dots = svg
      .append("g")
      .selectAll("circle")
      .data(parsedData)
      .join("circle")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.value))
      .attr("r", 6)
      .attr("fill", "#ffffff")
      .attr("stroke", "#5D3FD3")
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

        tooltip
          .style("opacity", 1)
          .style("left", `${mouseX}px`)
          .style("top", `${mouseY - 55}px`) 
          .html(`
            <div style="font-size: 11px; color: #64748B; font-weight: 500; margin-bottom: 2px; white-space: nowrap;">${dateFormatter(d.date)}</div>
            <div style="color: #5D3FD3; font-weight: bold; font-size: 13px;">Grade: ${d.value.toFixed(1)}%</div>
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

  }, [data, width, filterType]);

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

export default TrackingDottedGraph;
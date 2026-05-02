import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const TrackingDottedGraph = ({ data, width, filterType }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !width) return;

    const height = 450;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 50;
    const marginLeft = 60;

    // --- Find latest date in data ---
    const latestDateInData = data.length
      ? new Date(d3.max(data, (d) => new Date(d.date)))
      : new Date();

    let start, end, unit = "day";

    if (filterType === "week") {
      end = new Date(latestDateInData);
      start = new Date(latestDateInData);
      start.setDate(end.getDate() - 6);
    } else if (filterType === "month") {
      start = new Date(latestDateInData.getFullYear(), latestDateInData.getMonth(), 1);
      end = new Date(latestDateInData.getFullYear(), latestDateInData.getMonth() + 1, 0);
    } else if (filterType === "year") {
      start = new Date(latestDateInData.getFullYear(), 0, 1);
      end = new Date(latestDateInData.getFullYear(), 11, 31);
      unit = "month";
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
      const grades = dataMap[key] || [0];
      const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
      return { date, value: avg };
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
      .attr("stop-opacity", 0.6);

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

    const color = d3
      .scaleLinear()
      .domain([0, 50, 100])
      .range(["red", "yellow", "green"]);

    // --- Axes ---
    const xAxis =
      filterType === "year"
        ? d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%b"))
        : d3.axisBottom(x).ticks(d3.timeDay.every(1)).tickFormat(d3.timeFormat("%d"));

    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(5));

    // --- Area generator ---
    const area = d3
      .area()
      .x((d) => x(d.date))
      .y0(y(0))
      .y1((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    // --- Draw shaded area FIRST ---
    const areaPath = svg
      .append("path")
      .datum(parsedData)
      .attr("fill", "url(#area-gradient)")
      .attr("d", area)
      .attr("opacity", 0);

    areaPath
      .transition()
      .duration(800)
      .attr("opacity", 1);

    // --- Line generator ---
    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    const path = svg
      .append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("d", line);

    const totalLength = path.node().getTotalLength();

    path
      .attr("stroke-dasharray", totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000 + parsedData.length * 150)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // --- Dots ---
    const dots = svg
      .append("g")
      .selectAll("circle")
      .data(parsedData)
      .join("circle")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.value))
      .attr("r", 0)
      .attr("fill", (d) => color(d.value));

    dots
      .transition()
      .delay((d, i) => 800 + i * 150)
      .duration(300)
      .attr("r", 5);

  }, [data, width, filterType]);

  return <svg ref={svgRef}></svg>;
};

export default TrackingDottedGraph;
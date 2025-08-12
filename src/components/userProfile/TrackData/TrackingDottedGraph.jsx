import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const TrackingDottedGraph = ({ data, width, filterType }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || !width) return;

    const height = 500;
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
        return (
          date.getUTCFullYear() +
          "-" +
          String(date.getUTCMonth() + 1).padStart(2, "0") +
          "-" +
          String(date.getUTCDate()).padStart(2, "0")
        );
      } else {
        return (
          date.getUTCFullYear() +
          "-" +
          String(date.getUTCMonth() + 1).padStart(2, "0")
        );
      }
    }

    function generateDateRange(start, end, unit) {
      const range = [];
      let current = new Date(start);
      while (current <= end) {
        range.push(new Date(current));
        if (unit === "day") {
          current.setUTCDate(current.getUTCDate() + 1);
        } else if (unit === "month") {
          current.setUTCMonth(current.getUTCMonth() + 1);
        }
      }
      return range;
    }

    const dateRange = generateDateRange(utcStart, utcEnd, unit);

    const dataMap = {};
    data.forEach((d) => {
      const dateObj = new Date(d.date);
      const key = toUTCDateKey(dateObj);
      if (!dataMap[key]) {
        dataMap[key] = [];
      }
      const numericGrade = parseFloat(d.grade);
      dataMap[key].push(isNaN(numericGrade) ? 0 : numericGrade);
    });

    const parsedData = dateRange.map((date) => {
      const key = toUTCDateKey(date);
      const grades = dataMap[key] || [0];
      const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
      return { date, value: avg };
    });

    // --- Drawing and animation starts here ---
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.selectAll("*").remove();

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

    let xAxis;
    if (filterType === "year") {
      xAxis = d3
        .axisBottom(x)
        .ticks(d3.timeMonth.every(1))
        .tickFormat(d3.timeFormat("%b"));
    } else {
      xAxis = d3
        .axisBottom(x)
        .ticks(d3.timeDay.every(1))
        .tickFormat(d3.timeFormat("%d"));
    }

    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis)
      .call((g) => g.select(".domain").attr("stroke", "black"));

    let xAxisLabel;
    if (filterType === "year") {
      xAxisLabel = "Months";
    } else if (parsedData.length) {
      const formatMonthDay = d3.timeFormat("%b %d");
      const first = formatMonthDay(parsedData[0].date);
      const last = formatMonthDay(parsedData[parsedData.length - 1].date);
      xAxisLabel = `${first} - ${last}`;
    } else {
      xAxisLabel = "";
    }

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .style("font-size", "14px")
      .text(xAxisLabel);

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .call((g) => g.select(".domain").attr("stroke", "black"));

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90)`)
      .attr("x", -(height / 2))
      .attr("y", 15)
      .style("font-size", "14px")
      .text(filterType === "year" ? "Average Grade per Month (%)" : "Average Grade per Day (%)");

    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    // Append path and prepare for animation
    const path = svg
      .append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Animate the line drawing using stroke-dasharray trick
    const totalLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000 + parsedData.length * 150) // duration depends on number of dots
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // Append dots with initial radius 0
    const dots = svg
      .append("g")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.3)
      .selectAll("circle")
      .data(parsedData)
      .join("circle")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.value))
      .attr("r", 0) // start invisible
      .attr("fill", (d) => color(d.value));

    // Animate dots one by one
    dots
      .transition()
      .delay((d, i) => 800 + i * 150) // slightly after line starts drawing
      .duration(300)
      .attr("r", 5);
  }, [data, width, filterType]);

  return <svg ref={svgRef}></svg>;
};

export default TrackingDottedGraph;

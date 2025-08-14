import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";

const TrackingLoggedInActivity_Progress = ({ filterType }) => {
  const svgRef = useRef();
  const progressArray = useSelector((state) => state.personDetail.progressArray);
  const mark_sections = useSelector((state) => state.personDetail.marks_section);
  const timeGoals = useSelector((state) => state.personDetail.actual_time_goal);

  useEffect(() => {
    if (!progressArray || !mark_sections) return;
  
    const totalSections = progressArray.reduce((acc, topic) => acc + topic.sections.length, 0);
    const seenSections = new Set();
  
    // --- Determine latest and earliest dates based on filterType ---
    const latestDateInData = mark_sections.length
      ? new Date(d3.max(mark_sections, (d) => new Date(d.date)))
      : new Date();
  
    let startDate, endDate, timeUnit = "day";
  
    if (filterType === "week") {
      endDate = new Date(latestDateInData);
      startDate = new Date(latestDateInData);
      startDate.setDate(endDate.getDate() - 6);
    } else if (filterType === "month") {
      startDate = new Date(latestDateInData.getFullYear(), latestDateInData.getMonth(), 1);
      endDate = new Date(latestDateInData.getFullYear(), latestDateInData.getMonth() + 1, 0);
    } else if (filterType === "year") {
      startDate = new Date(latestDateInData.getFullYear(), 0, 1);
      endDate = new Date(latestDateInData.getFullYear(), 11, 31);
      timeUnit = "month";
    }
  
    // Helper to generate date key
    const toUTCDateKey = (date) => {
      if (timeUnit === "day") {
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
      } else {
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
      }
    };
  
    // Generate range of dates
    const generateDateRange = (start, end, unit) => {
      const range = [];
      let current = new Date(start);
      while (current <= end) {
        range.push(new Date(current));
        if (unit === "day") current.setUTCDate(current.getUTCDate() + 1);
        else current.setUTCMonth(current.getUTCMonth() + 1);
      }
      return range;
    };
  
    const allDates = generateDateRange(startDate, endDate, timeUnit);
  
    // Group marks by date
    const grouped = d3.group(
      mark_sections,
      (d) => toUTCDateKey(new Date(d.date))
    );
  
    let cumulativeTimeSpent = 0;
  
    const progressTimeline = allDates.map((day) => {
      const dayKey = toUTCDateKey(day);
      const entries = grouped.get(dayKey) || [];
  
      entries.forEach((entry) => seenSections.add(entry.section_name || "Rational Numbers"));
  
      entries.forEach((entry) => {
        entry.recordedAnswers?.forEach((ans) => {
          cumulativeTimeSpent += ans.timeTaken || 0;
        });
      });
  
      return {
        date: day,
        progress: (seenSections.size / totalSections) * 100,
        hours: cumulativeTimeSpent / 3600,
        timeGoal: timeGoals
      };
    });
  
    // --- D3 rendering ---
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 60, bottom: 70, left: 60 };
  
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    svg.selectAll("*").remove();
  
    // Clip path
    svg.append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom);
  
    // Scales
    const x = d3.scaleTime()
      .domain([startDate, endDate])
      .range([margin.left, width - margin.right]);
  
    const yLeft = d3.scaleLinear()
      .domain([0, 100]).nice()
      .range([height - margin.bottom, margin.top]);
  
    const maxHours = Math.max(d3.max(progressTimeline, (d) => d.hours), timeGoals || 0);
    const yRight = d3.scaleLinear()
      .domain([0, maxHours * 1.3]).nice()
      .range([height - margin.bottom, margin.top]);
  
    // Lines
    const lineProgress = d3.line()
      .x((d) => x(d.date))
      .y((d) => yLeft(d.progress));
  
    const lineHours = d3.line()
      .x((d) => x(d.date))
      .y((d) => yRight(d.hours));
  
    // Axes
    const xAxis = timeUnit === "month"
      ? d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%b"))
      : d3.axisBottom(x).ticks(d3.timeDay.every(1)).tickFormat(d3.timeFormat("%d"));
  
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .call((g) => g.select(".domain").attr("stroke", "black"));
  
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yLeft).ticks(5))
      .call((g) => g.select(".domain").attr("stroke", "black"));
  
    svg.append("g")
      .attr("transform", `translate(${width - margin.right},0)`)
      .call(d3.axisRight(yRight).ticks(5))
      .call((g) => g.select(".domain").attr("stroke", "black"));
  
    // Axis labels
    svg.append("text")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("Completion Progress (%)");
  
    svg.append("text")
      .attr("x", height / 2)
      .attr("y", width - 10)
      .attr("transform", `rotate(90, ${width - 10}, 0)`)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("Hours");
  
    const monthName = d3.timeFormat("%B")(startDate);
    svg.append("text")
      .attr("x", margin.left + (width - margin.left - margin.right) / 2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text(timeUnit === "month" ? "Months" : `Days in ${monthName}`);
  
    // Animate lines
    const drawLine = (path, duration = 1500) => {
      const totalLength = path.node().getTotalLength();
      path
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    };
  
    const progressPath = svg.append("path")
      .datum(progressTimeline)
      .attr("fill", "none")
      .attr("stroke", "#2196F3")
      .attr("stroke-width", 2)
      .attr("d", lineProgress)
      .attr("clip-path", "url(#clip)");
    drawLine(progressPath, 2000);
  
    const hoursPath = svg.append("path")
      .datum(progressTimeline)
      .attr("fill", "none")
      .attr("stroke", "#FF9800")
      .attr("stroke-width", 2)
      .attr("d", lineHours)
      .attr("clip-path", "url(#clip)");
    drawLine(hoursPath, 2000);
  
    // Time goal line
    svg.append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", yRight(timeGoals))
      .attr("y2", yRight(timeGoals))
      .attr("stroke", "#4CAF50")
      .attr("stroke-dasharray", "4 4")
      .attr("stroke-width", 2)
      .attr("clip-path", "url(#clip)")
      .attr("opacity", 0)
      .transition()
      .duration(2000)
      .attr("opacity", 1);
  
    // Legend (unchanged)
    const legendData = [
      { label: "Progress (%)", color: "#2196F3", type: "line" },
      { label: "Hours logged", color: "#FF9800", type: "line" },
      { label: "Time goal", color: "#4CAF50", type: "dashed" }
    ];
  
    const legend = svg.append("g")
      .attr("transform", `translate(${width - margin.right - 150}, ${margin.top})`);
  
    legendData.forEach((item, i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 20})`);
      legendRow.append("line")
        .attr("x1", 0)
        .attr("x2", 20)
        .attr("y1", 8)
        .attr("y2", 8)
        .attr("stroke", item.color)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", item.type === "dashed" ? "4 4" : null);
      legendRow.append("text")
        .attr("x", 30)
        .attr("y", 12)
        .attr("fill", "#333")
        .attr("font-size", "12px")
        .text(item.label);
    });
  
  }, [progressArray, mark_sections, timeGoals, filterType]);
  

  return <svg ref={svgRef}></svg>;
};

export default TrackingLoggedInActivity_Progress;

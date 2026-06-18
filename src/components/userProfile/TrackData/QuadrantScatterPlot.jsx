import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

const QuadrantScatterPlot = ({ topics = [], width = 600, filterType = "month" }) => {
  const d3Ref = useRef();
  const height = 350;

  // Map the parent state filter key to the proper UI badge text string
  const badgeMap = {
    week: "This Week",
    month: "This Month",
    year: "This Year"
  };

  useEffect(() => {
    if (!d3Ref.current || !width || !topics.length) return;

    // Clear older DOM elements cleanly before redraw cycles
    d3.select(d3Ref.current).selectAll("*").remove();

    // Give ample breathing room around boundaries
    const margin = { top: 40, right: 40, bottom: 50, left: 60 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const svg = d3.select(d3Ref.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scale mapping definitions
    const xScale = d3.scaleLinear().domain([0, 6]).range([0, plotWidth]);
    const yScale = d3.scaleLinear().domain([50, 100]).range([plotHeight, 0]);

    const midX = xScale(3);
    const midY = yScale(75);

    /* FIX 1: Adjusted 'y' positions for the labels.
      Top quadrants pushed higher (from 20 to 10), 
      Bottom quadrants pushed lower (from plotHeight - 20 to plotHeight - 8)
    */
    const quadrants = [
      { x: 15, y: 10, label: "DOING GREAT!", anchor: "start" },
      { x: plotWidth - 15, y: 10, label: "HIGH EFFICIENCY", anchor: "end" },
      { x: 15, y: plotHeight - 8, label: "NEEDS ASSISTANCE", anchor: "start" },
      { x: plotWidth - 15, y: plotHeight - 8, label: "JUST STARTING", anchor: "end" }
    ];

    // Render quadrant background title tags
    svg.selectAll(".quadrant-label")
      .data(quadrants)
      .enter()
      .append("text")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("text-anchor", d => d.anchor)
      .attr("fill", "#C0BDF2")
      .style("font-size", "10px")
      .style("font-weight", "700")
      .style("letter-spacing", "0.05em")
      .text(d => d.label);

    // Draw thin horizontal & vertical layout dividers
    svg.append("line")
      .attr("x1", midX).attr("y1", 0).attr("x2", midX).attr("y2", plotHeight)
      .attr("stroke", "#F1F5F9").attr("stroke-width", 1.5);

    svg.append("line")
      .attr("x1", 0).attr("y1", midY).attr("x2", plotWidth).attr("y2", midY)
      .attr("stroke", "#F1F5F9").attr("stroke-width", 1.5);

    // Render standard bottom and left baseline axes
    const xAxis = d3.axisBottom(xScale).ticks(3).tickSize(0).tickPadding(10);
    const yAxis = d3.axisLeft(yScale).ticks(3).tickSize(0).tickPadding(10);

    const xAxisG = svg.append("g").attr("transform", `translate(0,${plotHeight})`).call(xAxis);
    xAxisG.select(".domain").attr("stroke", "#F1F5F9").attr("stroke-width", 1.5);
    xAxisG.selectAll("text").attr("fill", "#94A3B8").style("font-size", "10px");

    const yAxisG = svg.append("g").call(yAxis);
    yAxisG.select(".domain").attr("stroke", "#F1F5F9").attr("stroke-width", 1.5);
    yAxisG.selectAll("text").attr("fill", "#94A3B8").style("font-size", "10px");

    // Dynamic Axis Structural Labels
    svg.append("text")
      .attr("x", plotWidth / 2).attr("y", plotHeight + 35).attr("text-anchor", "middle")
      .style("font-size", "9px").style("font-weight", "700").style("letter-spacing", "0.08em")
      .attr("fill", "#94A3B8").text("EFFORT (HOURS)");

    svg.append("text")
      .attr("transform", "rotate(-90)").attr("x", -plotHeight / 2).attr("y", -40).attr("text-anchor", "middle")
      .style("font-size", "9px").style("font-weight", "700").style("letter-spacing", "0.08em")
      .attr("fill", "#94A3B8").text("GRADE (%)");

    // Render Scatter Dots
    const dots = svg.selectAll(".topic-dot")
      .data(topics)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${xScale(d.timeSpent)},${yScale(d.numericGrade)})`);

    dots.append("circle")
      .attr("r", 7)
      .attr("fill", d => d.color || "#5D3FD3")
      .style("cursor", "pointer");

    dots.append("text")
      .attr("y", -12)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "600")
      .attr("fill", "#1E293B")
      .text(d => d.title);

  }, [width, topics]);

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col relative select-none">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-base font-bold text-slate-800 leading-snug">
            Grades vs Effort Analysis
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            Performance correlation based on study hours
          </p>
        </div>
        {/* FIX 2: Dynamic time badge container element mapped straight from application state */}
        <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full whitespace-nowrap">
          {badgeMap[filterType] || "This Month"}
        </span>
      </div>

      <div className="w-full flex items-center justify-center">
        <svg ref={d3Ref} className="mx-auto" />
      </div>
    </div>
  );
};

QuadrantScatterPlot.propTypes = {
  width: PropTypes.number,
  filterType: PropTypes.string,
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      numericGrade: PropTypes.number.isRequired,
      timeSpent: PropTypes.number.isRequired,
      color: PropTypes.string,
    })
  ).isRequired,
};

export default QuadrantScatterPlot;
import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import * as d3 from "d3";

const TopicMastery = () => {
  const progressArray = useSelector((state) => state.personDetail.progressArray);
  const svgRef = useRef();

  useEffect(() => {
    if (!progressArray || progressArray.length === 0) return;

    // Step 1: Extract best and latest grade per topic
    const topicsData = progressArray.map((topic) => {
      const sections = topic.sections || [];

      const bestGrade = d3.max(
        sections.map((s) => (s.best_grade !== undefined ? s.best_grade : 0))
      ) || 0;

      let latestGrade = 0;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].latest_grade && !isNaN(parseFloat(sections[i].latest_grade))) {
          latestGrade = parseFloat(sections[i].latest_grade);
          break;
        }
      }

      return {
        topic: topic.topic_name,
        best: bestGrade,
        latest: latestGrade,
      };
    });

    // Step 2: Set up dimensions
    const width = 700;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 80, left: 50 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove(); // clear previous render

    // Step 3: Scales
    const x0 = d3
      .scaleBand()
      .domain(topicsData.map((d) => d.topic))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const x1 = d3
      .scaleBand()
      .domain(["best", "latest"])
      .range([0, x0.bandwidth()])
      .padding(0.1);

    const maxGrade = d3.max(topicsData.flatMap((d) => [d.best, d.latest])) || 100;

    const y = d3
      .scaleLinear()
      .domain([0, Math.max(100, maxGrade)]) // at least 0–100
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3
      .scaleOrdinal()
      .domain(["best", "latest"])
      .range(["#4CAF50", "#2196F3"]);

    // Step 4: Axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")
      .attr("transform", "rotate(-35)")
      .style("text-anchor", "end");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Step 5: Bars with animation
    svg
      .append("g")
      .selectAll("g")
      .data(topicsData)
      .join("g")
      .attr("transform", (d) => `translate(${x0(d.topic)},0)`)
      .selectAll("rect")
      .data((d) => [
        { key: "best", value: d.best },
        { key: "latest", value: d.latest },
      ])
      .join("rect")
      .attr("x", (d) => x1(d.key))
      .attr("y", y(0)) // start at baseline
      .attr("width", x1.bandwidth())
      .attr("height", 0) // start with height 0
      .attr("fill", (d) => color(d.key))
      .transition()
      .duration(1000)
      .delay((d, i) => i * 150) // small stagger for effect
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => y(0) - y(d.value));

    // Step 6: Legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 150}, ${margin.top})`);

    ["best", "latest"].forEach((key, i) => {
      legend
        .append("rect")
        .attr("x", 0)
        .attr("y", i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(key));

      legend
        .append("text")
        .attr("x", 20)
        .attr("y", i * 20 + 12)
        .text(key)
        .style("font-size", "12px");
    });
  }, [progressArray]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default TopicMastery;

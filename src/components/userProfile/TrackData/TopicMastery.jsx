import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import * as d3 from "d3";

const temp_progressArray = [
  {
    topic_name: "Rational Numbers",
    sections: [
      { progress: 0, section_id: 3, section_name: "What are Rational Numbers" },
      { progress: 0, section_id: 5, section_name: "Subtracting Rational Numbers" },
      { progress: 1, best_grade: 100, latest_grade: "50.00", section_id: 6, section_name: "Multiplying Rational Numbers" },
      { progress: 0, section_id: 7, section_name: "Dividing Rational Numbers" },
      { progress: 0, section_id: 4, section_name: "Adding Rational Numbers" },
      { progress: 0, section_id: 8, section_name: "Combined Operations with Rational Numbers" }
    ]
  },
  {
    topic_name: "Exponent and Power",
    sections: [
      { progress: 1, best_grade: 80, latest_grade: "60.00", section_id: 9, section_name: "Laws of Exponents" },
      { progress: 0, section_id: 10, section_name: "Exponential Form" },
      { progress: 0, section_id: 11, section_name: "Negative Exponents" },
      { progress: 0, section_id: 12, section_name: "Powers of 10" }
    ]
  },
  {
    topic_name: "Polynomials",
    sections: [
      { progress: 0, section_id: 13, section_name: "Introduction to Polynomials" },
      { progress: 0, section_id: 14, section_name: "Types of Polynomials" },
      { progress: 1, best_grade: 90, latest_grade: "90.00", section_id: 15, section_name: "Addition of Polynomials" },
      { progress: 0, section_id: 16, section_name: "Subtraction of Polynomials" },
      { progress: 0, section_id: 17, section_name: "Multiplication of Polynomials" },
      { progress: 0, section_id: 18, section_name: "Division of Polynomials" }
    ]
  }
];

const TopicMastery = () => {
  const reduxProgressArray = useSelector((state) => state.personDetail.progressArray);

  // ✅ Fallback if Redux array is missing or empty
  const progressArray =
    reduxProgressArray && reduxProgressArray.length > 0
      ? reduxProgressArray
      : temp_progressArray;

  const svgRef = useRef();

  useEffect(() => {
    if (!progressArray || progressArray.length === 0) return;

    // Step 1: Extract best and latest grade per topic
    const topicsData = progressArray.map((topic) => {
      const sections = topic.sections || [];

      const bestGrade =
        d3.max(sections.map((s) => (s.best_grade !== undefined ? s.best_grade : 0))) || 0;

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
    const width = 620;
    const height = 440;
    const margin = { top: 50, right: 30, bottom: 80, left: 50 };

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

    const color = d3.scaleOrdinal().domain(["best", "latest"]).range(["#4CAF50", "#2196F3"]);

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
    const legend = svg.append("g").attr("transform", `translate(${width - 60}, ${margin.top -50})`);

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

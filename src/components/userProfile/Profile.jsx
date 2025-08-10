import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";

const Profile = () => {
  const completionProgress =
    useSelector((state) => state.personDetail.completionProgress);
  const current_grade =
    useSelector((state) => state.personDetail.current_grade) || 90;

  const goal_commitment =  useSelector((state) => state.personDetail.timeGoals) || 90;

  return (
    <div className="w-full h-full grid grid-cols-2 gap-1">
      <div className="">
        <Completion_graph name="Completed" value={completionProgress} />
      </div>
      <div className="">
        <Completion_graph name="Grade" value={current_grade} />
      </div>

      <div className="col-span-2 w-1/2 mx-auto">
        <Completion_graph name="Time Logged" value={goal_commitment} />
      </div>
    </div>
  );
};

export default Profile;

const Completion_graph = ({ name, value }) => {
  const ref = useRef(); // ✅ Define ref first

  useEffect(() => {
    const container = d3.select(ref.current);
    container.selectAll("*").remove(); // clear previous render

    const width = 250;
    const height = Math.min(160, width);
    const outerRadius = height / 2 - 10;
    const innerRadius = outerRadius * 0.75;
    const tau = 2 * Math.PI;

    let color;
    if (value < 50) {
      color = "red";
    } else if (value >= 50 && value <= 80) {
      color = "yellow";
    } else if (value > 80 && value < 100) {
      color = "#39ff14"; // neon green
    } else if (value === 100) {
      color = "purple";
    }

    const svg = container.append("svg").attr("viewBox", [0, 0, width, height]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0);

    // Background arc
    g.append("path")
      .datum({ endAngle: tau })
      .style("fill", "#ddd")
      .attr("d", arc);

    // Foreground arc (animated)
    const foreground = g
      .append("path")
      .datum({ endAngle: 0 })
      .style("fill", color)
      .attr("d", arc);

    // Text in center
    const text = g
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "1.8rem")
      .style("fill", "black")
      .style("font-weight", "800") // <-- slightly bold
      .text(`0%`);

    // Animate the arc and text from 0 to value
    const animate = () => {
      foreground
        .datum({ endAngle: 0 }) // reset arc
        .attr("d", arc)
        .transition()
        .duration(3000)
        .attrTween("d", function (d) {
          const interpolate = d3.interpolate(d.endAngle, (value / 100) * tau);
          return function (t) {
            d.endAngle = interpolate(t);
            return arc(d);
          };
        });

      text
        .transition()
        .duration(3000)
        .tween("text", function () {
          const i = d3.interpolate(0, value);
          return function (t) {
            text.text(`${Math.round(i(t))}%`);
          };
        });
    };

    // Run animation initially
    animate();

    // Repeat every 10 seconds
    // const interval = setInterval(animate, 10000);

    return () => {
    //   clearInterval(interval);
      container.selectAll("*").remove();
    };
  }, [value]);

  return (
    <div className="flex flex-col ">
      <div ref={ref} />
      <div className="text-center text-sm font-bold ">{name}</div>
    </div>
  );
};

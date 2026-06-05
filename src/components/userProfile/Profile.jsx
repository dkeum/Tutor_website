import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";

const Profile = () => {
  const completionProgress = useSelector((state) => state.personDetail.completionProgress) || 50;
  const current_grade = useSelector((state) => state.personDetail.current_grade) || 50;
  const goal_commitment = useSelector((state) => state.personDetail.timeGoals) || 50;

  return (
    <div className="w-full h-full grid grid-cols-2  gap-x-2 mb-4">
      <div className="flex justify-center mt-5">
        <Completion_graph name="COMPLETED" value={completionProgress} />
      </div>
      <div className="flex justify-center mt-5">
        <Completion_graph name="GRADE" value={current_grade} />
      </div>

      <div className="col-span-2 w-full flex justify-center -mt-8">
        <Completion_graph name="TIME LOGGED" value={goal_commitment} />
      </div>
    </div>
  );
};

export default Profile;

const Completion_graph = ({ name, value }) => {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;

    const container = d3.select(ref.current);
    container.selectAll("*").remove(); 

    const width = 160;
    const height = 160;
    const outerRadius = width / 2 - 10;
    const innerRadius = outerRadius * 0.76;
    const tau = 2 * Math.PI;

    const trackColor = "#EBF1FF";
    const brandPurple = "#6366F1"; 

    const svg = container
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("class", "block mx-auto");

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .cornerRadius(4);

    // Track baseline ring
    g.append("path")
      .datum({ endAngle: tau })
      .style("fill", trackColor)
      .attr("d", arc);

    // Foreground animated indicator path
    const foreground = g
      .append("path")
      .datum({ endAngle: 0 })
      .style("fill", brandPurple)
      .attr("d", arc);

    // Dynamic numeric node - isolated to keep center alignment locked over (0,0)
    const valueNode = g
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .style("fill", brandPurple)
      .style("font-size", "2.1rem")
      .style("font-weight", "800")
      .style("font-family", "system-ui, -apple-system, sans-serif")
      .text("0");

    // Percentage symbol - explicitly positioned relative to the center without disrupting the number layout
    g.append("text")
      .attr("dominant-baseline", "central")
      // Safely shifts the symbol slightly right and up on the absolute grid matrix
      .attr("dx", "1.15em") 
      .attr("dy", "-0.35em") 
      .style("fill", brandPurple)
      .style("font-size", "1.1rem")
      .style("font-weight", "700")
      .style("opacity", "0.9")
      .style("font-family", "system-ui, -apple-system, sans-serif")
      .text("%");

    // Dynamic Arc drawing transition curve loop
    foreground
      .transition()
      .duration(1800)
      .ease(d3.easeCubicOut)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate(d.endAngle, (Math.max(0, Math.min(100, value)) / 100) * tau);
        return function (t) {
          d.endAngle = interpolate(t);
          return arc(d);
        };
      });

    // Numerical text count-up values tween mapping
    valueNode
      .transition()
      .duration(1800)
      .ease(d3.easeCubicOut)
      .tween("text", function () {
        const i = d3.interpolate(0, value);
        return function (t) {
          d3.select(this).text(Math.round(i(t)));
        };
      });

    return () => {
      container.selectAll("*").remove();
    };
  }, [value]);

  return (
    <div className="flex flex-col items-center w-full max-w-[140px]">
      <div className="w-28 h-28" ref={ref} />
      <div className="text-center text-[11px] font-bold tracking-widest text-gray-400 mt-0 select-none">
        {name}
      </div>
    </div>
  );
};
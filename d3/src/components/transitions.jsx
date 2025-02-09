import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import gdp from "../datasets/gdp";
import happiness from "../datasets/happiness"; // You need a happiness dataset

const TransitionChart = () => {
  const svgRef = useRef();
  const [isTreemap, setIsTreemap] = useState(false); // Toggle state

  useEffect(() => {
    const data = isTreemap ? happiness : gdp;

    const width = 600;
    const height = 400;

    d3.select(svgRef.current).selectAll("*").remove(); // Clear previous chart

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g");

    const transition = d3.transition().duration(1000).ease(d3.easeCubicInOut);

    if (!isTreemap) {
      // BAR CHART
      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.Country))
        .range([0, width])
        .padding(0.2);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.Value)])
        .range([height, 0]);

      svg
        .selectAll("rect")
        .data(data, (d) => d.Country)
        .join(
          (enter) =>
            enter
              .append("rect")
              .attr("x", (d) => xScale(d.Country))
              .attr("y", height)
              .attr("width", xScale.bandwidth())
              .attr("height", 0)
              .style("fill", "steelblue")
              .transition(transition)
              .attr("y", (d) => yScale(d.Value))
              .attr("height", (d) => height - yScale(d.Value)),
          (update) =>
            update
              .transition(transition)
              .attr("x", (d) => xScale(d.Country))
              .attr("y", (d) => yScale(d.Value))
              .attr("width", xScale.bandwidth())
              .attr("height", (d) => height - yScale(d.Value)),
          (exit) =>
            exit.transition(transition).attr("height", 0).attr("y", height).remove()
        );
    } else {
      // TREEMAP
      const root = d3.hierarchy({ children: data }).sum((d) => d.Value);
      d3.treemap().size([width, height]).padding(4)(root);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      svg
        .selectAll("rect")
        .data(root.leaves(), (d) => d.data.Country)
        .join(
          (enter) =>
            enter
              .append("rect")
              .attr("x", (d) => width / 2) // Start from center
              .attr("y", (d) => height / 2)
              .attr("width", 0)
              .attr("height", 0)
              .style("fill", (d) => color(d.data.Country))
              .style("stroke", "#000")
              .transition(transition)
              .attr("x", (d) => d.x0)
              .attr("y", (d) => d.y0)
              .attr("width", (d) => d.x1 - d.x0)
              .attr("height", (d) => d.y1 - d.y0),
          (update) =>
            update
              .transition(transition)
              .attr("x", (d) => d.x0)
              .attr("y", (d) => d.y0)
              .attr("width", (d) => d.x1 - d.x0)
              .attr("height", (d) => d.y1 - d.y0),
          (exit) =>
            exit.transition(transition).attr("width", 0).attr("height", 0).remove()
        );

      // Add text labels
      svg
        .selectAll("text")
        .data(root.leaves(), (d) => d.data.Country)
        .join(
          (enter) =>
            enter
              .append("text")
              .attr("x", width / 2)
              .attr("y", height / 2)
              .attr("opacity", 0)
              .transition(transition)
              .attr("x", (d) => d.x0 + 5)
              .attr("y", (d) => d.y0 + 20)
              .attr("opacity", 1)
              .text((d) => d.data.Country)
              .attr("font-size", "12px")
              .attr("fill", "white"),
          (update) =>
            update
              .transition(transition)
              .attr("x", (d) => d.x0 + 5)
              .attr("y", (d) => d.y0 + 20),
          (exit) =>
            exit.transition(transition).attr("opacity", 0).remove()
        );
    }
  }, [isTreemap]);

  return (
    <div>
      <button onClick={() => setIsTreemap(!isTreemap)}>
        Switch to {isTreemap ? "GDP Bar Chart" : "Happiness Treemap"}
      </button>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default TransitionChart;

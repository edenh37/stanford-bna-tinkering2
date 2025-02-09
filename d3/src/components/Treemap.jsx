import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import gdp from "../datasets/gdp";

const Treemap = () => {
  const svgRef = useRef();

  useEffect(() => {
    const data = gdp;

    const width = 800;
    const height = 450;

    const transition = d3.transition().duration(1000).ease(d3.easeCubicInOut);

    d3.select(svgRef.current).selectAll("*").remove(); // Clear previous chart

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g"); // an SVG element to group other elements

    const root = d3.hierarchy({ children: data }).sum((d) => d.Value); // Sum based on the "Value" field (GDP value)

    // Apply the treemap layout
    d3.treemap().size([width, height]).padding(4)(root);

    // color scheme from d3 library: https://d3js.org/d3-scale-chromatic/categorical
    const color = d3.scaleOrdinal(d3.schemePastel1);

    // Create the rectangles for the treemap
    svg
      .selectAll("rect")
      .data(root.leaves())
      .join((enter) =>    // use .join because doing a fade in transition -- otherwise would just do .enter and have all the following lines separate
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
          .attr("height", (d) => d.y1 - d.y0)
      )

    // Add text labels to each rectangle
    svg
      .selectAll("text")
      .data(root.leaves())
      .join((enter) =>
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
          .attr("fill", "black")
      )
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default Treemap;

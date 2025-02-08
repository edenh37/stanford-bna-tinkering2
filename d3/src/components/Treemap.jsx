import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import gdp from "../datasets/gdp";

const Treemap = () => {
  const svgRef = useRef();

  useEffect(() => {
    const data = gdp;

    const width = 600;
    const height = 400;

    d3.select(svgRef.current).selectAll("*").remove(); // Clear previous chart

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g");

    // Hierarchy conversion, with the GDP sum based on the "Value" field
    const root = d3
      .hierarchy({ children: data })
      .sum((d) => d.Value); // Sum based on the "Value" field (GDP value)

    // Apply the treemap layout
    d3.treemap().size([width, height]).padding(4)(root);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create the rectangles for the treemap
    svg
      .selectAll("rect")
      .data(root.leaves())
      .enter()
      .append("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .style("fill", (d) => color(d.data.Country)) // Access "Country" for color
      .style("stroke", "#000");

    // Add text labels to each rectangle
    svg
      .selectAll("text")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("x", (d) => d.x0 + 5)
      .attr("y", (d) => d.y0 + 20)
      .text((d) => d.data.Country) // Display country name
      .attr("font-size", "12px")
      .attr("fill", "white");
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default Treemap;

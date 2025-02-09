import * as d3 from "d3";
import { useEffect, useRef } from "react";
import happinessData from "../datasets/happiness";

// tutorial via https://kamibrumi.medium.com/getting-started-with-react-d3-js-d86ccea05f08


const Barchart = () => {
  const ref = useRef();

  useEffect(() => {
    // first, need to remove previously rendered svg
    d3.select(ref.current).select("svg").remove();

    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 700 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const transition = d3.transition().duration(1000).ease(d3.easeCubicInOut);

    // append the svg object to the body of the page
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis creation
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(happinessData.map((d) => d.Country))
      .padding(0.2);

      // Draw the X-axis
      svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleLinear().domain([7, 7.8]).range([height, 0]); // Adjusted for happiness index

    svg.append("g").call(d3.axisLeft(y));

    // Tooltip
    const tooltip = d3.select(ref.current)
      .append("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("border", "1px solid #ddd")
      .style("padding", "5px")
      .style("display", "none")
      .style("pointer-events", "none");

      const color = d3.scaleOrdinal(d3.schemePastel1);
    // bars
    svg
    .selectAll("rect")
    .data(happinessData)
    .join("rect")
    .attr("x", (d) => x(d.Country))
    .attr("y", (d) => y(d.Value))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d.Value))
    .attr("fill", color)
    .on("mouseover", function (event, d) {
      d3.select(this).attr("fill", "blue");
      tooltip
        .style("display", "block")
        .html(`<strong>${d.Country}</strong>: ${d.Value}`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 20 + "px");
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 20 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("fill", color);
      tooltip.style("display", "none");
    });
}, []);

return <div ref={ref} />;
};

export default Barchart;
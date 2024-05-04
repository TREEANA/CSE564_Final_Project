import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const MDSPlot2 = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:2000/mds_plot_2')
      .then(response => response.json())
      .then(data => {
        setData(data);
        drawPlot(data);
      });
  }, []);

  const drawPlot = (data) => {
    if (!chartRef.current || !data) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 5, right: 20, bottom: 55, left: 60 };
    const width = 360 - margin.left - margin.right;
    const height = 220 - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
      .domain([d3.min(data.x), d3.max(data.x)+0.15])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(data.y), d3.max(data.y)])
      .range([height, 0]);

    const svgContent = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scatter plot points
    svgContent.selectAll("circle")
      .data(data.columns) // Use the columns data to bind to circles
      .join("circle")
      .attr("cx", (_, i) => xScale(data.x[i]))
      .attr("cy", (_, i) => yScale(data.y[i]))
      .attr("r", 4)
      .attr("fill", "blue");

    // Adding variable names as labels next to the points
    svgContent.selectAll("text.labels")
      .data(data.columns)
      .join("text")
      .attr("x", (_, i) => xScale(data.x[i]))
      .attr("y", (_, i) => yScale(data.y[i]))
      .attr("dx", 8) // Offset from the circle
      .attr("dy", ".35em") // Vertical alignment
      .text(d => d)
      .style("font-size", "8px")
      .style("fill", "black");

    // Axes
    const xAxis = svgContent.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    xAxis.append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("fill", "#000")
        .style("text-anchor", "middle")
        .style("font-size", "8px")
        .text("MDS1");

    const yAxis = svgContent.append("g")
        .call(d3.axisLeft(yScale));

    yAxis.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", -height / 2)
        .attr("dy", "1em")
        .attr("fill", "#000")
        .style("text-anchor", "middle")
        .text("MDS2");
  };

  return (
    <>
      <h5 style={{ textAlign: 'center'}}>Variables MDS Plot </h5>
      <h6 style={{ textAlign: 'center', marginBottom: '40px' }}>using 1-|Correlation| distance</h6>
      <svg ref={chartRef} width="360" height="220"></svg>
    </>
  );
};

export default MDSPlot2;

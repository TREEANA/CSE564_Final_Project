import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const MDSPlot = ({k}) => {
  const chartRef = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    
    fetch(`http://localhost:2000/mds_plot_1/${k}`)
      .then(response => response.json())
      .then(data => {
        setData(data);
        drawPlot(data);
      });
  }, [k]);

  const drawPlot = (data) => {
    if (!chartRef.current || !data) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 360 - margin.left - margin.right;
    const height = 220 - margin.top - margin.bottom;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const xScale = d3.scaleLinear()
      .domain([d3.min(data.x), d3.max(data.x)])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(data.y), d3.max(data.y)])
      .range([height, 0]);

    const svgContent = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svgContent.selectAll("circle")
      .data(data.points)
      .join("circle")
      .attr("cx", (_, i) => xScale(data.x[i]))
      .attr("cy", (_, i) => yScale(data.y[i]))
      .attr("r", 2.5)
      .attr("fill", d => color(d.Cluster_ID));

    const xAxis = svgContent.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    xAxis.append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("fill", "#000")
        .style("text-anchor", "middle")
        .text("MDS1");

    const yAxis = svgContent.append("g")
        .call(d3.axisLeft(yScale));

    yAxis.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -45)
        .attr("x", -height / 2)
        .attr("dy", "1em")
        .attr("fill", "#000")
        .style("text-anchor", "middle")
        .text("MDS2");

    const legendData = Array.from(new Set(data.points.map(d => d.Cluster_ID))).sort();

    const legend = svgContent.selectAll(".legend")
        .data(legendData)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0, ${i * 15})`);

    legend.append("rect")
        .attr("x", width - 9)
        .attr("width", 9)
        .attr("height", 9)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 13)
        .attr("y", 8.5)
        .style("text-anchor", "end")
        .style("font-size", "12px")
        .text(d => `Cluster ${d}`);
  };

  return (<>
  <h5 style={{ textAlign: 'center' , marginBottom: '50px'}}>MDS plot (use the Euclidian distance) </h5>
  <svg ref={chartRef} width="360" height="220"></svg>
  </>)
};

export default MDSPlot;

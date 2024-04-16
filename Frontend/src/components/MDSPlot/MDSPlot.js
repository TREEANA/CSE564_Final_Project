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

    const margin = { top: 20, right: 20, bottom: 70, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
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
      .attr("r", 5)
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
        .attr("y", -60)
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
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => `Cluster ${d}`);
  };

  return (<>
  <h3 style={{ color: 'blue' }}>MDS plot (use the Euclidian distance) </h3>
  <svg ref={chartRef} width="800" height="500"></svg>;
  </>)
};

export default MDSPlot;

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const LineChart = ({setK, k }) => {
  const ref = useRef();
  const margin = { top: 20, right: 30, bottom: 40, left: 60 };
  const width = 400 - margin.left - margin.right;
  const height = 190 - margin.top - margin.bottom;
  const [data, setData] = useState(null);
  const [eblow, setElbow] = useState(3);


  useEffect(() => {

		axios.get('http://localhost:2000/elbow_plot').then((repos) => {
			const getData = repos.data;
			setData(getData);
		  });


		  axios.get('http://localhost:2000/best_k').then((repos) => {
			const getData = repos.data;
			// setElbow(getDta)
      setElbow(3)

		  });
  }, []);


  useEffect(() => {
    if (data  && eblow&& ref.current) {
      const svg = d3.select(ref.current);
      svg.selectAll("*").remove(); 

     
      const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

      // x 축 설정
      const x = d3.scaleBand()
                  .range([0, width])
                  .domain(data.x.map(d => d))
                  .padding(0.1);

      chart.append("g")
           .attr("transform", `translate(0,${height})`)
           .call(d3.axisBottom(x))
           .selectAll("text")
           .style("text-anchor", "middle");

      chart.append("text")
           .attr("class", "x axis-label")
           .attr("x", width / 2) 
           .attr("y", height + margin.bottom) 
           .style("text-anchor", "middle") 
           .style("font-size", "8px")
           .text("Number of k cluster");

      // y 축 설정
      const y = d3.scaleLinear()
                  .domain([0, d3.max(data.y)*1.1])
                  .range([height, 0]);

      chart.append("g").call(d3.axisLeft(y));

      chart.append("text")
      .attr("class", "y axis-label")
      .attr("transform", "rotate(-90)") 
      .attr("y", -margin.left) 
      .attr("x", -(height / 2)) 
      .attr("dy", "1em") 
      .style("text-anchor", "middle") 
      .style("font-size", "8px")
      .text("SSE");

      
        // 각 막대의 중심에 점을 추가
    chart.selectAll(".point")
    .data(data.x.map((x, i) => ({ x, y: data.y[i] })))
    .enter().append("circle")
    .attr("class", "point")
    .attr("cx", d => x(d.x) + x.bandwidth() / 2)
    .attr("cy", d => y(d.y)-5)
    .attr("r", 5)
    .attr("fill", "red");

    // 점들을 연결하는 라인을 추가
    const line = d3.line()
                  .x(d => x(d.x) + x.bandwidth() / 2) 
                  .y(d => y(d.y)-5); 

    chart.append("path")
        .datum(data.x.map((x, i) => ({ x, y: data.y[i] }))) 
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", line);


    if (k !== null) {
      // "Select" 텍스트와 눈금선을 추가할 막대의 x 위치 계산
      const selectedX = x(k) + x.bandwidth() / 2;
      const selectedY = y(data.y[data.x.indexOf(k)]);

    
      chart.selectAll(".selected-text, .selected-line").remove();

    
      chart.append("text")
        .attr("class", "selected-text")
        .attr("x", selectedX)
        .attr("y", selectedY ) 
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-weight", "bold") 
        .style("font-size", "40px")
        .text("*");

      // // 선택된 막대에 눈금선 추가
      // chart.append("line")
      //   .attr("class", "selected-line")
      //   .attr("x1", selectedX)
      //   .attr("x2", selectedX)
      //   .attr("y1", selectedY-10)
      //   .attr("y2", height)
      //   .attr("stroke", "black")
      //   .attr("stroke-width", 1)
      //   .attr("stroke-dasharray", "5,5");
    }

    if (eblow !== null) {
      
      const selectedX = x(eblow) + x.bandwidth() / 2;
      const selectedY = y(data.y[data.x.indexOf(eblow)]);


      chart.selectAll(".selected-txt, .selected-lne").remove();


      chart.append("text")
        .attr("class", "selected-txt")
        .attr("x", selectedX)
        .attr("y", selectedY - 50) 
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-weight", "bold") 
        .text("elbow");

      chart.append("line")
        .attr("class", "selected-lne")
        .attr("x1", selectedX)
        .attr("x2", selectedX)
        .attr("y1", selectedY-40)
        .attr("y2", height)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "5,5");
    }

      // 막대 그리기
      chart.selectAll(".bar")
           .data(data.x.map((x, i) => ({ x, y: data.y[i] })))
           .enter().append("rect")
           .attr("class", "bar")
           .attr("x", d => x(d.x))
           .attr("y", d => y(d.y))
           .attr("width", x.bandwidth())
           .attr("height", d => height - y(d.y))
           .attr("fill", "steelblue")
           .on("mouseover", function(_, d) { d3.select(this).attr("fill", "red"); 
       svg.append("text")
       .attr("id", "tooltip")
       .attr("x",  220)
       .attr("y", 40)
       .attr("text-anchor", "middle")
       .text(`SSE: ${d.y}`);
    })
       .on("mouseout", function() { d3.select(this).attr("fill", "steelblue");
       svg.select("#tooltip").remove(); })
           .on("click", function(_, d) {
            setK(d.x);
          });

    }
  }, [data,k]);

  return (
    <>
      <h5 style={{ textAlign: 'center' }}>KMean MSE Plot (Elbow method)</h5>
      <h6 style={{ textAlign: 'center', marginBottom: '50px' }}>{`Selected the number of Number of k cluster : ${k}`}</h6>
      <svg ref={ref} width={370} height={190}/>
    </>
  );
}

export default LineChart;

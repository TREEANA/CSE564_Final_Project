import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';


const ChoroplethMap = () => {
  const svgRef = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    fetch('http://localhost:2000/choropleth_data')
      .then(response => response.json())
      .then(data => {
        drawMap(data);
      });

    const drawMap = (geoData) => {
      const svg = d3.select(svgRef.current);
      const projection = d3.geoMercator().fitSize([800, 500], geoData);
      const pathGenerator = d3.geoPath().projection(projection);
      const colorScale = d3.scaleSequential(d3.interpolateCool)
                          .domain(d3.extent(geoData.features, d => d.properties.price));

      const paths = svg.selectAll(".neighborhood")
        .data(geoData.features)
        .join("path")
        .attr("class", "neighborhood")
        .attr("d", pathGenerator)
        .attr("fill", d => d.properties.price ? colorScale(d.properties.price) : '#fff')
        .attr("stroke", "black");


        paths.on("click", (event, d) => {
       
            const clickedPath = d3.select(event.currentTarget);
            if (d.properties.price) {
             paths.attr("fill", d => d.properties.price ? colorScale(d.properties.price) : '#fff');
              clickedPath.attr("fill", "yellow"); // 클릭된 경로를 노란색으로 변경
    
              setSelectedCity({ name: d.properties.neighbourhood, price: d.properties.price });
            } else {
              setSelectedCity(null); // 데이터가 없는 지역을 클릭한 경우
            }
          });

      svg.selectAll(".label")
        .data(geoData.features)
        .join("text")
        .attr("class", "label")
        .attr("x", d => pathGenerator.centroid(d)[0])
        .attr("y", d => pathGenerator.centroid(d)[1])
        .text(d => d.properties.neighbourhood.substring(0, 5))
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "8px");
    };
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div>
        <h1>Choropleth Map</h1>
        <svg ref={svgRef} width={800} height={500}></svg>
      </div>
      <div style={{ marginLeft: '20px' }}>
        <h2>City Details</h2>
        {selectedCity ? (
          <>
            <p><strong>Name:</strong> {selectedCity.name}</p>
            <p><strong>Average Price:</strong> ${selectedCity.price.toFixed(2)}</p>
          </>
        ) : (
          <p><strong>Name:</strong> Choose a city</p>
        )}
      </div>
    </div>
  );
};

export default ChoroplethMap;

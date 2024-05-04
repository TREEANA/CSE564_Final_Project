import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const ChoroplethMap = () => {
  const svgRef = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedAttribute, setSelectedAttribute] = useState('price');

  const ordered_columns = [
    'review_scores_cleanliness',
    'review_scores_rating',
    'review_scores_accuracy',
    'review_scores_value',
    'review_scores_communication',
    'review_scores_location',
    'number_of_reviews',
    'bedrooms',
    'bathrooms',
    'accommodates',
    'host_total_listings_count',
    'price',
  ];

  useEffect(() => {
    fetch(`http://localhost:2000/choropleth_data/${selectedAttribute}`)
      .then(response => response.json())
      .then(data => {
        drawMap(data);
      });
  }, [selectedAttribute]);

  const drawMap = (geoData) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous drawings

    const projection = d3.geoEquirectangular().fitSize([400, 300], geoData);
    const pathGenerator = d3.geoPath().projection(projection);
    const colorScale = d3.scaleSequential(d3.interpolateCool)
                          .domain(d3.extent(geoData.features, d => d.properties[selectedAttribute]));

    const paths = svg.selectAll(".neighborhood")
      .data(geoData.features)
      .join("path")
      .attr("class", "neighborhood")
      .attr("d", pathGenerator)
      .attr("fill", d => d.properties[selectedAttribute] ? colorScale(d.properties[selectedAttribute]) : '#ccc')
      .attr("stroke", "black");

    paths.on("click", (event, d) => {
      const clickedPath = d3.select(event.currentTarget);
      if (d.properties[selectedAttribute]) {
        paths.attr("fill", d => d.properties[selectedAttribute] ? colorScale(d.properties[selectedAttribute]) : '#ccc');
        clickedPath.attr("fill", "yellow");
        setSelectedCity({ name: d.properties.neighbourhood, value: d.properties[selectedAttribute] });
      } else {
        setSelectedCity(null);
      }
    });

    // svg.selectAll(".label")
    //   .data(geoData.features)
    //   .join("text")
    //   .attr("class", "label")
    //   .attr("x", d => pathGenerator.centroid(d)[0])
    //   .attr("y", d => pathGenerator.centroid(d)[1])
    //   .text(d => d.properties.neighbourhood.substring(0, 5))
    //   .attr("text-anchor", "middle")
    //   .attr("fill", "black")
    //   .attr("font-size", "8px");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div>
        <h5 style={{textAlign: 'center'}}>Choropleth Map</h5>
        <svg ref={svgRef} width={400} height={300}></svg>
      </div>
      <div>
        <h5>Neighborhood Details</h5>
        {selectedCity ? (
          <>
            <p><strong>Name:</strong> {selectedCity.name}</p>
            <p><strong>{selectedAttribute}:</strong> {selectedCity.value.toFixed(2)}</p>
          </>
        ) : (
          <p><strong>Name:</strong> Choose a neighborhood</p>
        )}
        <div>
          <label htmlFor="attribute-selector">Select Attribute: </label>
          <select
            id="attribute-selector"
            value={selectedAttribute}
            onChange={e => setSelectedAttribute(e.target.value)}
          >
            {ordered_columns.map(attr => (
              <option key={attr} value={attr}>{attr.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ChoroplethMap;

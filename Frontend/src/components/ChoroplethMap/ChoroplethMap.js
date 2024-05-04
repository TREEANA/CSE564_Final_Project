import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const ChoroplethMap = () => {
  const svgRef = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedAttribute, setSelectedAttribute] = useState('price');

  const orderedColumns = [
    'cleanliness',
    'rating',
    'accuracy',
    'value',
    'communication',
    'location',
    'number_of_reviews',
    'bedrooms',
    'bathrooms',
    'num_accommodations',
    'host_total_listings_count',
    'price',
  ];

  useEffect(() => {
    fetch(`http://localhost:2000/choropleth_data/${selectedAttribute}`)
      .then((response) => response.json())
      .then((data) => {
        drawMap(data);
      });
  }, [selectedAttribute]);

  const drawMap = (geoData) => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous drawings

    const svgWidth = 800;
    const svgHeight = 500;

    const projection = d3.geoEquirectangular().fitSize([svgWidth, svgHeight], geoData);
    const pathGenerator = d3.geoPath().projection(projection);
    const extent = d3.extent(geoData.features, (d) => d.properties[selectedAttribute]);

    // Sequential color map using d3.interpolateBlues
    const colorScale = d3.scaleSequential(d3.interpolateReds).domain(extent);

    // Draw the paths
    const paths = svg
      .selectAll('.neighborhood')
      .data(geoData.features)
      .join('path')
      .attr('class', 'neighborhood')
      .attr('d', pathGenerator)
      .attr('fill', (d) =>
        d.properties[selectedAttribute] ? colorScale(d.properties[selectedAttribute]) : '#ccc'
      )
      .attr('stroke', 'black');

    // Handle click events on each path
    paths.on('click', (event, d) => {
      const clickedPath = d3.select(event.currentTarget);
      if (d.properties[selectedAttribute]) {
        paths.attr('fill', (d) =>
          d.properties[selectedAttribute] ? colorScale(d.properties[selectedAttribute]) : '#ccc'
        );
        clickedPath.attr('fill', 'yellow');
        setSelectedCity({ name: d.properties.neighbourhood, value: d.properties[selectedAttribute] });
      } else {
        setSelectedCity(null);
      }
    });

    // Create a vertical gradient legend
    const legendWidth = 15;
    const legendHeight = 200;
    const numTicks = 6;

    const legendGroup = svg.append('g').attr('transform', 'translate(20, 20)');

    // Append a gradient definition
    const defs = legendGroup.append('defs');
    const linearGradient = defs
      .append('linearGradient')
      .attr('id', 'vertical-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%'); // Vertically oriented gradient

    // Create gradient stops for a sequential color map
    linearGradient
      .selectAll('stop')
      .data(d3.range(0, 1.01, 0.1))
      .enter()
      .append('stop')
      .attr('offset', (d) => `${d * 100}%`)
      .attr('stop-color', (d) => colorScale(extent[0] + d * (extent[1] - extent[0])));

    // Draw the rectangle filled with vertical gradient
    legendGroup
      .append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#vertical-gradient)');

    // Adjust the legend scale to have the smallest at the bottom
    const legendScale = d3.scaleLinear().domain(extent).range([0, legendHeight]);

    // Draw axis to display tick marks and labels for the vertical legend
    const legendAxis = d3.axisRight(legendScale).ticks(numTicks).tickFormat(d3.format('.2f'));
    legendGroup.append('g').attr('transform', `translate(${legendWidth}, 0)`).call(legendAxis);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div>
        <h5 style={{ textAlign: 'center' }}>Choropleth Map</h5>
        <svg ref={svgRef} width={800} height={500}></svg>
      </div>
      <div style={{ marginLeft: '-100px' }}>
        <h5>Neighborhood Details</h5>
        {selectedCity ? (
          <>
            <p>
              <strong>Name:</strong> {selectedCity.name}
            </p>
            <p>
              <strong>{selectedAttribute}:</strong> {selectedCity.value.toFixed(2)}
            </p>
          </>
        ) : (
          <p>
            <strong>Name:</strong> Choose a neighborhood
          </p>
        )}
        <div>
          <label htmlFor='attribute-selector'>Select Attribute: </label>
          <select
            id='attribute-selector'
            value={selectedAttribute}
            onChange={(e) => setSelectedAttribute(e.target.value)}
          >
            {orderedColumns.map((attr) => (
              <option key={attr} value={attr}>
                {attr.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ChoroplethMap;

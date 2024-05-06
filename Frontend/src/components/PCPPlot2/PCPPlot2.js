import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const PCPPlot2 = ({k}) => {
  const chartRef = useRef(null);
  const [data, setData] = useState(null);
  const [selectedAxes, setSelectedAxes] = useState({ first: 'default', second: 'default' });
  const [columnNames, setColumnNames] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [loading, setLoading] = useState(true);
  // this is the MDS (1-|Correlation|) Distance axis order for columns without Cluster_ID
  const ordered_columns = [
    'bedrooms',
    'max_capacity',
    'price',
    'bathrooms',
    'location',
    'communication',
    'value',
    'accuracy',
    'rating',
    'number_of_reviews',
    'host_total_listings_count',
    'host_acceptance_rate',
    'Cluster_ID' ]

    useEffect(() => {
      fetch(`http://localhost:2000/pcp_plot_2/${k}`)
        .then(response => response.json())
        .then(data => {
          // 데이터 컬럼 순서 재정렬을 위한 새로운 데이터 배열 생성

          const reorderedData = data.map(item => {
            const newItem = {};
            ordered_columns.forEach(col => {
              // 존재하지 않는 컬럼에 대해서는 undefined를 할당할 수 있으므로, 존재 여부를 체크
              if(item.hasOwnProperty(col)){
                newItem[col] = item[col];
              } else {
                // 해당 컬럼이 없는 경우, 기본값 설정 (예: null, 또는 적절한 기본값)
                newItem[col] = null; // 또는 적절한 기본값
              }
            });
            return newItem;
          });

          const reorderedData2 = reorderedData.map(item => {
            const newItem = {};
            ordered_columns.forEach(col => {
              newItem[col] = item[col];
            });
            return newItem;
          });
    
          // 재정렬된 데이터 설정
          setData(reorderedData2);
    
          // 컬럼명 순서 설정 (Cluster_ID 제외)
          setColumnNames(ordered_columns.filter(col => col !== "Cluster_ID"));
    
          // 그래프 다시 그리기
          drawPlot(reorderedData);
          setLoading(false); 
        });
    }, [k]);

  useEffect(() => {
    drawPlot(data);
  }, [refreshData]);


  const handleAxisChange = (axis, value) => {
    setSelectedAxes(prev => ({ ...prev, [axis]: value }));
  };

  // Function to apply changes and fetch new plot data
  const handleApplyChanges = () => {
    if (selectedAxes.first !== 'default' && selectedAxes.second !== 'default') {
      // 새로운 데이터 구조를 생성
      const swappedData = data.map(item => {
        const newItem = {};
        
        Object.keys(item).forEach(key => {
          if (key === selectedAxes.first) {
            // 첫 번째 선택된 컬럼명을 두 번째 컬럼명으로 스왑
            newItem[selectedAxes.second] = item[key];
          } else if (key === selectedAxes.second) {
            // 두 번째 선택된 컬럼명을 첫 번째 컬럼명으로 스왑
            newItem[selectedAxes.first] = item[key];
          } else {
            // 나머지 컬럼명은 그대로 유지
            newItem[key] = item[key];
          }
        });
        return newItem;
      });

      const swappedData2 = swappedData.map(item => {
        const newItem = { ...item };
        
        // 선택된 두 컬럼의 데이터 교환
        const temp = newItem[selectedAxes.first];
        newItem[selectedAxes.first] = newItem[selectedAxes.second];
        newItem[selectedAxes.second] = temp;
  
        return newItem;
      });


  
      // 컬럼 이름 자체도 스왑해야 하므로, 새로운 컬럼 이름 배열 생성
      const newColumnNames = columnNames.map(col => {
        if (col === selectedAxes.first) return selectedAxes.second;
        if (col === selectedAxes.second) return selectedAxes.first;
        return col;
      });
  
      // 상태 업데이트
      setData(swappedData2);
      setColumnNames(newColumnNames); // 업데이트된 컬럼 이름 상태
      setSelectedAxes({ first: 'default', second: 'default' }); // 축 선택 초기화
      setRefreshData(prev => !prev); // 데이터 갱신 트리거
    }
  };
  

  const findClosestLabel = (dropX, dddd,xScale) => {

  
    return dddd.reduce((prev, curr) => {
      return (Math.abs(xScale(curr) - dropX) < Math.abs(xScale(prev) - dropX)) ? curr : prev;
    });
  };

  const handleApplyChanges2 = (draggedLabel, dropTargetLabel,plotData) => {
    if (draggedLabel !== dropTargetLabel) {
      
      const swappedData = plotData.map(item => {
        const newItem = {};
        
        Object.keys(item).forEach(key => {
          if (key === draggedLabel) {
            // 첫 번째 선택된 컬럼명을 두 번째 컬럼명으로 스왑
            newItem[dropTargetLabel] = item[key];
          } else if (key === dropTargetLabel) {
            // 두 번째 선택된 컬럼명을 첫 번째 컬럼명으로 스왑
            newItem[draggedLabel] = item[key];
          } else {
            // 나머지 컬럼명은 그대로 유지
            newItem[key] = item[key];
          }
        });
        return newItem;
      });

      const swappedData2 = swappedData.map(item => {
        const newItem = { ...item };
        
        // 선택된 두 컬럼의 데이터 교환
        const temp = newItem[draggedLabel];
        newItem[draggedLabel] = newItem[dropTargetLabel];
        newItem[dropTargetLabel] = temp;
  
        return newItem;
      });

      const dddd = Object.keys(plotData[0]).filter(d => d !== "Cluster_ID");

      const newColumnNames = dddd.map(col => {
        if (col === draggedLabel) return dropTargetLabel;
        if (col === dropTargetLabel) return draggedLabel;
        return col;
      });
  
      // 상태 업데이트
      setData(swappedData2);
      setColumnNames(newColumnNames); // 업데이트된 컬럼 이름 상태
      setSelectedAxes({ first: 'default', second: 'default' }); // 축 선택 초기화
      setRefreshData(prev => !prev); // 데이터 갱신 트리거
    }
    
  };


  const drawPlot = (plotData) => {
    if (!chartRef.current || !plotData) return;

    const svgContainer = d3.select(chartRef.current);
    svgContainer.selectAll("*").remove();

    const dimensions = Object.keys(plotData[0]).filter(d => d !== "Cluster_ID");
    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const margin = { top: 10, right: 35, bottom: 140, left: 10 },
          width = 750 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

    const x = d3.scalePoint()
                .range([0, width])
                .padding(1)
                .domain(dimensions);

    const y = dimensions.reduce((acc, dim) => {
      const extent = d3.extent(plotData, d => +d[dim]);
      acc[dim] = d3.scaleLinear()
                   .domain([Math.min(0, extent[0]), extent[1]])
                   .range([height, 0]);
      return acc;
    }, {});

    const svg = svgContainer
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

                var highlight = function(event, d) {
                  d3.selectAll(".line")
                    .transition().duration(200)
                    .style("stroke", "lightgrey")
                    .style("opacity", "0.2");
              
                  d3.selectAll(".cluster" + d.Cluster_ID)
                    .transition().duration(200)
                    .style("stroke", colors(d.Cluster_ID))
                    .style("opacity", "1");
                };
              
                // Unhighlight 함수
                var doNotHighlight = function() {
                  d3.selectAll(".line")
                    .transition().duration(200).delay(1000)
                    .style("stroke", d => colors(d.Cluster_ID))
                    .style("opacity", "0.5");
                };
              
                // path 함수
                const path = d => d3.line()(dimensions.map(p => [x(p), y[p](d[p])]));
              
                // 라인 그리기
                svg.selectAll(".line")
                  .data(plotData)
                  .enter().append("path")
                    .attr("class", d => "line cluster" + d.Cluster_ID) // 클러스터 ID를 기반으로 클래스 지정
                    .attr("d", path)
                    .style("fill", "none")
                    .style("stroke", d => colors(d.Cluster_ID)) // 클러스터 ID를 기반으로 색상 지정
                    .style("opacity", 0.5)
                    .on("mouseover", highlight)
                    .on("mouseleave", doNotHighlight);

                svg.selectAll(".axis")
                    .data(dimensions).enter()
                    .append("g")
                    .attr("class", "axis")
                    .attr("transform", d => `translate(${x(d)})`)
                    .each(function(d) { d3.select(this).call(d3.axisLeft(y[d])); });

      svg.selectAll(".axis")

    .data(dimensions).enter()
    .append("g")
    .attr("class", "axis")
    // Position each axis on the plot
    .attr("transform", d => `translate(${x(d)},0)`)
    .each(function(d) { d3.select(this).call(d3.axisLeft(y[d])); })
    // Remove previous text elements if any
    .selectAll("text").remove();

    const drag = d3.drag()
    .on("start", function(event, d) {

    })
    .on("drag", function(event, d) {
      


            const newPosX = event.x;
            d3.select(this).attr("transform", `translate(${newPosX},0)`);
          
            // 드래그된 축에 대한 업데이트
            const dimensionIndex = dimensions.indexOf(d);
            dimensions.splice(dimensionIndex, 1); // 기존 위치에서 제거
            const dropTargetIndex = Math.round(newPosX / (width / dimensions.length));
            dimensions.splice(dropTargetIndex, 0, d); // 새 위치에 삽입
          
            x.domain(dimensions); // xScale 업데이트
          
            // 모든 선을 업데이트
            svg.selectAll(".line")
              .attr("d", path);

      
    })
    .on("end", function(event, d) {
      // 드래그가 끝났을 때 실행될 로직
      const draggedLabel = d;
      const dddd = Object.keys(plotData[0]).filter(d => d !== "Cluster_ID");
      const xScale = d3.scalePoint()
        .range([0, width])
        .padding(1)
        .domain(dddd);
      
  
      const dropX = event.x;
      const dropTargetLabel = findClosestLabel(dropX,dddd, xScale);
    
      handleApplyChanges2(draggedLabel, dropTargetLabel,plotData);

    });

  svg.selectAll(".axis")
    // Add new text elements for axis titles
    .call(drag)
    .append("text")
    .style("text-anchor", "end")
    .attr("transform", d => `translate(0,${height})rotate(-60)`)
    .attr("y", 0)  // Offset the labels further down from the axes
    .attr("x", -10)
    .text(d => d)
    .style("fill", "black");
    

    const legendData = Array.from(new Set(plotData.map(d => d.Cluster_ID))).sort();

    const legend = svg.selectAll(".legend")
      .data(legendData)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(${width - 65},${i * 15 + height / 1000})`);

    legend.append("rect")
      .attr("x", 22)
      .attr("width", 11)
      .attr("height", 11)
      .style("fill", colors);

    legend.append("text")
      .attr("x", 35)
      .attr("y", 5.5)
      .attr("dy", ".35em")
      .style("font-size", "13px")
      .text(d => `Cluster ${d}`);
  };

  return (
    <div style={{ width: '800px', height: '300px', margin: 'auto' }}>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <progress max="100" value="50">Loading...</progress>
        </div>
      ) : (
        <>
          <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <table>
              <tbody>
                <tr>
                  <td>Axes Ordering</td>
                  <td>
                    <select value={selectedAxes.first} onChange={(e) => handleAxisChange('first', e.target.value)}>
                      <option value="default">Default</option>
                      {columnNames.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select value={selectedAxes.second} onChange={(e) => handleAxisChange('second', e.target.value)}>
                      <option value="default">Default</option>
                      {columnNames.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button onClick={handleApplyChanges}>Apply Changes</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <svg ref={chartRef} />
        </>
      )}
    </div>
  );
};

export default PCPPlot2;

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const RadarPlot = ({radarLocs}) => {
    const chartRef = useRef(null);
    const [data, setData] = useState(null);
    const [selectedAttr, setSelectedAttr] = useState(["rating",
                                                      "accuracy",
                                                      "cleanliness",
                                                      "communication",
                                                      "location",
                                                      "value"]);
    const attributeList = [
        "rating",
        "accuracy",
        "cleanliness",
        "communication",
        "location",
        "value",
        "num_accommodations",
        "bedrooms",
        "bathrooms",
        "host_acceptance_rate",
        "number_of_reviews",
        "price"
    ]
    useEffect(() => {
        let qParamStr = "";
        for (let i = 0; i < radarLocs.length; i++) {
            qParamStr += `loc=${radarLocs[i]}&`;
        }
        for (let i = 0; i < selectedAttr.length; i++) {
            qParamStr += `attrb=${selectedAttr[i]}&`;
        }
        fetch(`http://localhost:2000/radar?${qParamStr}`)
            .then(response => response.json())
            .then(data => {
                setData(data);
                drawPlot(data);
        });
    }, [radarLocs, selectedAttr])

    const drawPlot = (data) => {
        if (!chartRef.current || !data) return;

        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 70, left: 20 };
        const width = 400 - margin.left - margin.right;
        const height = 320 - margin.top - margin.bottom;
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const attributes = data[0].map((i, _) => i.axis)
        const maxValue = 5;

        const svgContent = svg.append("g")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const radius = Math.min(width, height) / 2.4;
        const angleSlice = Math.PI * 2 / attributes.length;

        const radiusScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([0, radius])
        
        const levels = 5;
        const axisGrid = svgContent.append("g").attr("class", "axisWrapper");

        axisGrid.selectAll(".gridCircle")
            .data(d3.range(1, levels+1).reverse())
            .join("circle")
                .attr("class", "gridCircle")
                .attr("r", d => radius / levels * d)
                .style("fill", "#CDCDCD")
                .style("stroke", "#CDCDCD")
                .style("fill-opacity", 0.1)
                .attr("transform", `translate(${width / 2}, ${height / 2})`)

        const axes = axisGrid.selectAll(".axis")
            .data(attributes)
            .join("g")
            .attr("class", "axis")

        axes.append("line")
            .attr("x1", width / 2)
            .attr("y1", height / 2)
            .attr("x2", (d, i) => width / 2 + radiusScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("y2", (d, i) => height / 2 + radiusScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2))
            .attr("class", "line")
            .style("stroke", "white")
            .style("stroke-width", "2px");

        axes.append("text")
            .attr("class", "legend")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", (d, i) => (width / 2) + (radiusScale(maxValue) * 1.25) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("y", (d, i) => (height / 2) + (radiusScale(maxValue) * 1.25) * Math.sin(angleSlice * i - Math.PI / 2))
            .text(d => d)
            .call(wrap, 50)
            .on("click", (e, d) => {
                const idx = selectedAttr.indexOf(d.replaceAll(" ", "_"));
                console.log(idx)
                createDropdown(e, idx);
            });

        if (data[0][0].value) {
            const radarLine = d3.lineRadial()
                                .curve(d3.curveLinearClosed)
                                .radius(d => radiusScale(d.value))
                                .angle((d, i) => i * angleSlice)

            const blobWrapper = svgContent.selectAll(".radarWrapper")
                                .data(data)
                                .join("g")
                                .attr("class", "radarWrapper")

            blobWrapper.append("path")
                    .attr("class", "radarArea")
                    .attr("d", (d, i) => radarLine(d))
                    .style("fill", (d, i) => color(i))
                    .style("fill-opacity", 0.5)
                    .attr("transform", `translate(${width / 2}, ${height / 2})`);

            blobWrapper.selectAll(".point")
                    .data((i, j) => i)
                    .join("circle")
                            .attr("class", "point")
                            .attr("r", 4)
                            .attr("cx", (d, i) => (width / 2) + radiusScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
                            .attr("cy", (d, i) => (height / 2) + radiusScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
                            .style("fill", (d, i) => color(d.i))
                            .style("fill-opacity", 0.85)
        }

        //Using http://bl.ocks.org/mbostock/7555321
        function wrap(text, width) {
            text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 0.75,
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
                
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
            });
        }

        function createDropdown(e, idx) {
            const dropdown = document.createElement("select");
            attributeList.forEach(x => {
                const option = document.createElement("option");
                option.value = x;
                option.text = x;
                dropdown.appendChild(option);
            })
            dropdown.value = e.target.__data__.replaceAll(" ", "_")
            dropdown.style.position = "absolute";
            dropdown.style.left = `${e.pageX}px`;
            dropdown.style.top = `${e.pageY}px`;
            document.body.appendChild(dropdown);
            dropdown.focus();

            dropdown.onchange = () => {
                const newAttr = [...selectedAttr];
                newAttr[idx] = dropdown.value;
                console.log(newAttr);
                setSelectedAttr(newAttr);
                try {
                    document.body.removeChild(dropdown);
                } catch (error) {
                    console.error(error)
                }
            }

            dropdown.onblur = () => {
                document.body.removeChild(dropdown);
            }
        }

    }
    return (<>
        <h5 style={{ textAlign: 'center' }}>Radar Plot</h5>
        <svg ref={chartRef} width="400" height="320"></svg>
    </>)
}

export default RadarPlot;
import { useEffect, useState } from "react"
import * as d3 from "d3";

export default function TopTable({setRadarLocs, radarLocs, sharedAttr}) {
    const [data, setData] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        d3.json(`http://localhost:2000/toptable?srt=${sortOrder}&attrb=${sharedAttr}`)
            .then((data) => {
                setData(data);
                setRadarLocs(data.slice(0, 3).map(x => x.neighborhood));
            });
    }, [sharedAttr, sortOrder])

    const handleRowClick = (attr) => {
        if (radarLocs.includes(attr)) {
            setRadarLocs(radarLocs.filter(x => x !== attr))
        } else {
            setRadarLocs([...radarLocs, attr])
        }
    }

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    }

    return (
        <>
            <h5 style={{textAlign: 'center', marginBottom: '0px'}}>{sortOrder === "asc" ? "Bottom": "Top"} 5 Neighborhoods by</h5>
            <h5 style={{textAlign: 'center'}}>{sharedAttr.replaceAll("_", " ")}</h5>
            <table>
                <thead>
                    <tr>
                        <th style={{width: '150px'}}>Neighborhood</th>
                        <th onClick={toggleSortOrder} style={{width: '185px'}}>{sharedAttr} {sortOrder === "asc" ? "↑" : "↓"}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, ind) => (
                        <tr key={ind} 
                            onClick={() => handleRowClick(row.neighborhood)}
                            style={{backgroundColor: radarLocs.includes(row.neighborhood) ? "yellow" : "unset"}}>
                            <td>{row.neighborhood}</td>
                            <td>{row.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}
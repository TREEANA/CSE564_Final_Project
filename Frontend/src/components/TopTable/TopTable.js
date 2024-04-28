import { useEffect, useState } from "react"
import * as d3 from "d3";

export default function TopTable({setRadarLocs}) {
    const [data, setData] = useState([]);
    const [selectedNbhoods, setSelectedNbhoods] = useState([]);

    useEffect(() => {
        d3.json(`http://localhost:2000/toptable`)
            .then((data) => {
                setData(data);
                setSelectedNbhoods(data.slice(0, 3).map(x => x.neighborhood));
                setRadarLocs(data.slice(0, 3).map(x => x.neighborhood));
            });
    }, [])

    const handleRowClick = (attr) => {
        if (selectedNbhoods.includes(attr)) {
            setSelectedNbhoods(selectedNbhoods.filter(x => x !== attr))
            setRadarLocs(selectedNbhoods.filter(x => x !== attr))
        } else {
            setSelectedNbhoods([...selectedNbhoods, attr])
            setRadarLocs([...selectedNbhoods, attr])
        }
        
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Neighborhood</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, ind) => (
                    <tr key={ind} 
                        onClick={() => handleRowClick(row.neighborhood)}
                        style={{border: selectedNbhoods.includes(row.neighborhood) ? "2px solid red" : "none"}}>
                        <td>{row.neighborhood}</td>
                        <td>{row.value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
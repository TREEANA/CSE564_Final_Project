import { useEffect, useState } from "react"
import * as d3 from "d3";

export default function TopTable({setRadarLocs}) {
    const [data, setData] = useState([]);
    const [selectedNbhoods, setSelectedNbhoods] = useState([]);
    const [selectedAttr, setSelectedAttr] = useState("price");

    const attributeList = [
        "review_scores_rating",
        "review_scores_accuracy",
        "review_scores_cleanliness",
        "review_scores_communication",
        "review_scores_location",
        "review_scores_value",
        "accommodates",
        "bedrooms",
        "bathrooms",
        "host_acceptance_rate",
        "number_of_reviews",
        "price"
    ]

    useEffect(() => {
        d3.json(`http://localhost:2000/toptable?attrb=${selectedAttr}`)
            .then((data) => {
                setData(data);
                setSelectedNbhoods(data.slice(0, 3).map(x => x.neighborhood));
                setRadarLocs(data.slice(0, 3).map(x => x.neighborhood));
            });
    }, [selectedAttr])

    const handleRowClick = (attr) => {
        if (selectedNbhoods.includes(attr)) {
            setRadarLocs(selectedNbhoods.filter(x => x !== attr))
            setSelectedNbhoods(selectedNbhoods.filter(x => x !== attr))
        } else {
            setRadarLocs([...selectedNbhoods, attr])
            setSelectedNbhoods([...selectedNbhoods, attr])
        }
        
    }

    function createDropdown(e, idx) {
        console.log(e.target.textContent)
        const dropdown = document.createElement("select");
        attributeList.forEach(x => {
            const option = document.createElement("option");
            option.value = x;
            option.text = x;
            dropdown.appendChild(option);
        })
        dropdown.value = e.target.textContent.replaceAll(" ", "_")
        dropdown.style.position = "absolute";
        dropdown.style.left = `${e.pageX}px`;
        dropdown.style.top = `${e.pageY}px`;
        document.body.appendChild(dropdown);
        dropdown.focus();

        dropdown.onchange = () => {
            setSelectedAttr(dropdown.value);
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

    return (
        <table>
            <thead>
                <tr>
                    <th>Neighborhood</th>
                    <th onClick={createDropdown}>{selectedAttr}</th>
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
import React, { useState } from "react";
import PCPPlot from '../../components/PCPPlot/PCPPlot';
import PCPPlot2 from '../../components/PCPPlot2/PCPPlot2';
import './PCPPage.css'; // 스타일 시트 임포트

const PCPPage = ({ k, setK }) => {
    const [showFirstPlot, setShowFirstPlot] = useState(true);

    const togglePlot = () => {
        setShowFirstPlot(!showFirstPlot);
    };

    return (
        <>
            <h1>{showFirstPlot ? "Parallel Coordinates Plot" : "MDS Parallel Coordinates Plot"}</h1>
            <div className="toggle-switch">
                <input
                    id="toggle"
                    type="checkbox"
                    checked={!showFirstPlot}
                    onChange={togglePlot}
                    className="checkbox"
                />
                <label htmlFor="toggle" className="slider"></label>
            </div>

            {showFirstPlot ? <PCPPlot k={k} /> : <PCPPlot2 k={k} />}
        </>
    );
};

export default PCPPage;

import React, { useState, useEffect } from 'react';
import './DashBoard.css';

import MDSPlot2 from '../../components/MDSPlot2/MDSPlot2';
import LineChart from '../../components/LineChart/LineChart';
import PCPPage from '../PCPPage/PCPPage'
import TopTable from '../../components/TopTable/TopTable';
import RadarPlot from '../../components/RadarPlot/RadarPlot';
import ChoroplethMap from '../../components/ChoroplethMap/ChoroplethMap';



const DashBoard = ({  k,  setK, radarLocs, setRadarLocs }) => {
  const [sharedAttr, setSharedAttr] = useState("price");
  return (
    <div className="dashboard-container">

      <div className='radar-plot-container'>
        <div>
          <ChoroplethMap setSharedAttr={setSharedAttr}/>
        </div>
        <div className='radar'>
          <TopTable setRadarLocs={setRadarLocs} radarLocs={radarLocs} sharedAttr={sharedAttr}></TopTable>
        </div>
        <div className='radar'>
          <RadarPlot setRadarLocs={setRadarLocs} radarLocs={radarLocs}></RadarPlot>
        </div>
      </div>

      <div className="mds-plots-container">
        <div className="mds-plot">
          <LineChart  k={k} setK={setK} />
        </div>
        <div className="mds-plot">
          <MDSPlot2 k={k} />
        </div>
        <div className="pcp-plot">
          <PCPPage  k={k}/>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;

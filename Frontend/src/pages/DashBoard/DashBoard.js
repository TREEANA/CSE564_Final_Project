import React, { useState, useEffect } from 'react';
import './DashBoard.css';

import MDSPlot from '../../components/MDSPlot/MDSPlot';
import MDSPlot2 from '../../components/MDSPlot2/MDSPlot2';
import PCPPlot from '../../components/PCPPlot/PCPPlot';
import PCPPlot2 from '../../components/PCPPlot2/PCPPlot2';
import LineChart from '../../components/LineChart/LineChart';

const DashBoard = ({  k,  setK}) => {
  return (
    <div className="dashboard-container">
      <div className="mds-plots-container">
      <div className="mds-plot">
          <LineChart  k={k} setK={setK} />
        </div>
  
        <div className="mds-plot">
          <MDSPlot k={k} />
        </div>
        <div className="mds-plot">
          <MDSPlot2 />
        </div>




      </div>
      <div className="pcp-plots-container">
        <div className="pcp-plot">
          <PCPPlot  k={k}/>
        </div>
        <div className="pcp-plot">
          <PCPPlot2  k={k} />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;

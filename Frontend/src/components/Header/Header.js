import React, { useState } from "react";
import { Link , useHistory} from "react-router-dom";
import "./Header.css";

const Header = () => {


  return (
    <>
      <header className="header">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="header__title">New York Housing Data by Air bnb</div>
        </Link>
        <div className="header_menu">

          <Link to="/MSEPlot">
            <button>MSEPlot</button>
          </Link>
          <Link to="/ChoroplethMap">
            <button>ChoroplethMap</button>
          </Link>

          
          <Link to="/MDSPlot">
            <button>MDSPlot</button>
          </Link>

          <Link to="/MDSPlot2">
            <button>MDSPlot2</button>
          </Link>

          <Link to="/PCPPlot">
            <button>PCPPlot</button>
          </Link>
          <Link to="/PCPPlot2">
            <button>PCPPlot2</button>
          </Link>
 

        </div>
      </header>
    </>
  );
};

export default Header;

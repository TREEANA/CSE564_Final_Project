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
      </header>
    </>
  );
};

export default Header;

import React from "react";
import { Link } from "react-router-dom";
import useScroll from "../hooks/useScroll";
import "../styles/NavBarCenter.css";
import NavLink from "./NavLink";


const NavBarCenter = ({ openContactModal }) => {

  const scrolling = useScroll(150); // offset לפי מה שאתה קובע

  return (
    <div className={`navbar-center ${scrolling ? "shrink" : ""}`}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <h1
          className={`brand-title rubik-gemstones-regular ${
            scrolling ? "hide-logo" : "show-logo"
          }`}
        >
          <div className="logo-text">
            <div className="main-logo-text">LE PLATEAU</div>
            <div className="divider-container">
              <div className="line" />
              <span className="subtitle-logo">BY SHANEL</span>
              <div className="line" />
            </div>
          </div>
        </h1>
      </Link>
   <div className="navlink-wrapper">
        <NavLink openContactModal={openContactModal} />
      </div>

    </div>

    
    
  );
};



export default NavBarCenter ;
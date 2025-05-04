
import React, { useState, useEffect } from "react";
import "../styles/NavBar.css";
import "../styles/hiddenLogo.css";
import logo from "../logo/LL.png";
import NavLink from "./NavLink";
import Hamburger from "./Hamburger"
import { Link } from "react-router-dom";
import useScroll from "../hooks/useScroll";



const NavBar = () => {
  

  const scrolling = useScroll();

  return (
    
    <header className={`navbar ${scrolling ? " shrink" : ""}`}>
      <div className={`navbar-logo ${scrolling ? " hidden" : ""}`}>
      <Link to="/">
      <img src={logo} alt="Dairy Delights Logo"  className={`logo ${scrolling ? "revome-title" : ""}`} />
    </Link>
      </div>
     
      <div className= {`navbar-center ${scrolling ? " shrink" : ""}`}>
      <Link to="/" style={{ textDecoration: " none" }}>
      <h1 className={`brand-title rubik-gemstones-regular ${scrolling ? "revome-title" : ""}`}>
        מעדני שנאל
      </h1>
      
    </Link>
        
      <NavLink/>
      </div>
     
      <div className="navbar-right ">
        
      <Hamburger scrolling={scrolling} />
   
        <div className={`numPhone ${scrolling ? " hidden" : ""}`}>050-3225482</div>
      </div>
    </header>
  );
};

export default NavBar;

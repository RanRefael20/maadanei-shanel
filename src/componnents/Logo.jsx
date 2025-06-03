import React from "react";
import "../styles/Logo.css";
import cheeseIcon from "../assets/cheese-icon.svg";
const Logo = () => {
  return (
    <div className="logo-container">
      <div className="logo-main">
        <div className="logo-title">LE PLATEAU</div>
        <div className="logo-subtitle">BY SHANEL</div>
        <div className="logo-line" />
      </div>
      <img src={cheeseIcon} alt="cheese" className="cheese-icon" />
    </div>
  );
};

export default Logo;

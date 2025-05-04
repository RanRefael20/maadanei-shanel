import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Hamburger.css";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { color } from "framer-motion";


const Hamburger =({ scrolling }) => {
  const [showMenu, setShowMenu] = useState(false);
  const wrapperRef = useRef(null);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const handleItemClick = () => {
    setShowMenu(false); // סוגר את התפריט כשנלחץ קישור
  };

  // סגירה בלחיצה מחוץ
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
   
    <div className={`hamburger-wrapper ${scrolling ? " scrolling" : ""}`} ref={wrapperRef}>
      
      <button className="hamburger-btn" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {showMenu && (
        
  <div className={`hamburger-menu ${scrolling ? " scrolling" : ""}`}>
    <a
      href="https://wa.me/972503225482"
      target="_blank"
      rel="noopener noreferrer"
      className="menu-button whatsapp"
      onClick={handleItemClick}
    >
      <FaWhatsapp size={18} className="icon" />
      WhatsApp-  <p>צ'אט</p>
    </a>
    

    <a
      href="https://wa.me/c/972503225482"
      target="_blank"
      rel="noopener noreferrer"
      className="menu-button whatsapp"
      onClick={handleItemClick}
    >
      <FaWhatsapp size={18} className="icon" />
      WhatsApp Catalog 
    </a>

    <a
      href="tel:0503225482"
      className="menu-button phone"
      onClick={handleItemClick}
    >
      <FaPhoneAlt size={16} className="iconPhone" />
      חיוג 050-3225482
    </a>
  </div>
)}

    </div>
  );
};

export default Hamburger;

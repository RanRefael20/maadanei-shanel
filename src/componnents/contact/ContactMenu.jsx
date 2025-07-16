import React, { useState, useEffect, useRef } from "react";
import "./ContactMenu.css";

const ContactMenu = () => {
  const [showOptions, setShowOptions] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions])
 

  return (
    <div className="contact-container" ref={menuRef}>

   <button className="phone-button" onClick={() => setShowOptions(true)}>
        📲
      </button>
      
      {showOptions && (
        <div className="contact-options">
          <a href="tel:0503225482" className="contact-option">
            📱 התקשר: 050-322-5482
          </a>
          <a href="tel:0502255425" className="contact-option">
            📱 התקשר: 050-225-5425
          </a>
          <a
            href="https://wa.me/972503225482"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-option"
          >
            💬 וואטסאפ
          </a>
          <button className="contact-option" onClick={() => alert("צ'אט עם נציג יופעל כאן")}>
            👤 צ'אט עם נציג
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactMenu;

import React from "react";
import { useNavigate } from "react-router-dom";
import "./PromoBanner.css";



const PromoBanner = ({ username = "אורח" , onClick }) => {
  const navigate = useNavigate();



  return (
    <div className="promo-banner" onClick={onClick}>
      <div className="promo-content">
        <div className="promo-line">
          <div className="badge-above-word">חדש 🔥</div>
          <h2 className="promo-title">
            קונים צוברים <span className="icons">🎉💰</span>
          </h2>
        </div>
        <p className="promo-subtitle">
          מזמינים וצוברים מכל הזמנה <strong>30%</strong> – ואפילו לאחר מימוש הנקודות!
        </p>
        <p className="promo-extra">← המשך</p>
      </div>
    </div>
  );
};

export default PromoBanner;

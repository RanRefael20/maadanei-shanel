import React from "react";
import { useNavigate } from "react-router-dom";
import "./PromoBanner.css";
import useAuthSync from "../../hooks/useAuthSync";

const PromoBanner = ({ onClick }) => {
  const navigate = useNavigate();
  const { user } = useAuthSync();

  return (
    <div className="promo-banner" onClick={onClick}>
      <div className="promo-content">
        <div className="promo-line">
          <div className="badge-above-word">חדש 🔥</div>
          <h2 className="promo-title">
           
            {!user && <span className="for-members-only"> קונים צוברים{" "} - לרשומים בלבד💰</span>}{" "}
            {user && <span className="for-members-only"> קונים צוברים{" "}            <span className="icons">🎉💰</span>
 </span>}{" "}

          </h2>
        </div>

        <p className="promo-subtitle">
          מזמינים וצוברים מכל הזמנה <strong>30%</strong> – ואפילו לאחר מימוש הנקודות!
        </p>

        {user ? (
          <p className="promo-extra">← המשך</p>
        ) : (
          <p className="promo-extra">
            ←{" "}
            <span className="register-now">
              הרשמה חינם
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default PromoBanner;

// DailyPromoBanner.jsx
import React, { useEffect, useState } from "react";
import "./DailyPromoBanner.css";
import useAuthSync from "../../hooks/useAuthSync";


const gradients = [
  "linear-gradient(90deg, #1f2e52, #ff2767)",
  "linear-gradient(90deg, #1a3e3e, #29b3b1)",
  "linear-gradient(90deg, #4b2c5e, #ff8fa3)"
];

const getWeekNumber = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - start) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
};

const weekGradient = gradients[getWeekNumber() % gradients.length];

const dailyMessages = [
  {
    title: "חדש! Shanel Back",
    subtitle: "קבלו 30% החזר על כל הזמנה – האירוח הבא עלינו (כמעט)..."
  },
  {
    title: "חדש! טעמת? החזרת",
    subtitle: "עם 30% החזר – זה לא רק טעים, זה גם משתלם."
  },
  {
    title: "חדש! Shanel Rewards ❤️",
    subtitle: "קיבלת שולחן? קיבלת החזר. 30% חזרה על כל הזמנה"
  }
];

const getCurrentMessageIndex = () => {
  const today = new Date();
  return today.getDate() % dailyMessages.length;
};

const DailyPromoBanner = ({ onClick }) => {
  const { user } = useAuthSync();
  const [message, setMessage] = useState(dailyMessages[getCurrentMessageIndex()]);

  useEffect(() => {
    const index = getCurrentMessageIndex();
    setMessage(dailyMessages[index]);
  }, []);

  return (
    <div className="daily-promo-banner" onClick={onClick}>
      <div className="daily-promo-content">
        <div className="daily-promo-line">
          <h2 className="daily-title">
            <span className="highlighted-word">{message.title}</span>
          </h2>
        </div>
        <p className="daily-subtitle">{message.subtitle}</p>
        {user ? (
          <p className="daily-extra">← המשך להזמנה</p>
        ) : (
          <p className="daily-extra">
            ← <span className="daily-register">הצטרפו עכשיו</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default DailyPromoBanner;
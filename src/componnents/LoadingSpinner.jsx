import React, { useEffect, useState } from "react";
import "../styles/LoadingSpinner.css";

const LoadingSpinner = ({ text = "טוען...", result = null , setMessage }) => {
  const [showResult, setShowResult] = useState(false);

  // הצגת ההודעה לאחר עיכוב קצר
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setShowResult(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [result]);

  // הסתרה אוטומטית של ההודעה לאחר 3 שניות
  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showResult]);

  return (
    <div className="processing">
      {!showResult ? (
        <>
          <div className="spinner" />
          <div className="loading-text">{text}</div>
        </>
      ) : 
          <div className="loading-result-box">
            <div className={`result-icon ${result === "success" ? "checkmark" : "xmark"}`} />
            <div className="loading-text">{result}</div>
          </div>
}
    </div>
  );
};

export default LoadingSpinner;

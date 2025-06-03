import React from "react";
import "../styles/LoadingSpinner.css"; // תוכל לעצב כרצונך

const LoadingSpinner = ({ text = "טוען..." }) => {
  return (
    <div className="processing">
      <div className="spinner" />
      <div className="loading-text">{text}</div>
    </div>
  );
};

export default LoadingSpinner;

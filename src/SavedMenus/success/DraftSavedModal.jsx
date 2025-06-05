// 📁 src/modals/DraftSavedModal.jsx
import React from "react";
import ReactDOM from "react-dom";
import "../success/DraftSavedModal.css";

const DraftSavedModal = ({ onClose }) => {
  return ReactDOM.createPortal(
    <div className="draft-saved-overlay">
      <div className="draft-saved-modal">
        <h2>✅ טיוטה נשמרה</h2>
        <p>! התפריט שלך נשמר בהצלחה ב- תפריטים ששמרת</p>
        <button className="close-button" onClick={onClose}>✖</button>
      </div>
    </div>,
    document.body
  );
};

export default DraftSavedModal;

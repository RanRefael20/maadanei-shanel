// RegisterErrorModal.jsx
import React from "react";
import ReactDOM from "react-dom";
import "./RegisterErrorModal.css";

const RegisterErrorModal = ({ onClose, errorMessage }) => {
  return ReactDOM.createPortal(
    <div className="error-overlay">
      <div className="error-modal">
        <button className="error-close-button" onClick={onClose}>✖</button>
        <h2 className="error-title">הרשמה נכשלה</h2>
        <p className="error-message">{errorMessage || "אירעה שגיאה לא ידועה."}</p>
      </div>
    </div>,
    document.body
  );
};

export default RegisterErrorModal;

import React from "react";
import ReactDOM from "react-dom";
import "./LoginModal.css";

const LoginModal = ({ onClose, onSwitchToRegister }) => {
  return ReactDOM.createPortal(
    <div className="login-overlay">
      <div className="login-modal">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2 className="login-title">התחברות</h2>

        <input type="text" className="login-input" placeholder="שם משתמש" />
        <input type="password" className="login-input" placeholder="סיסמה" />

        <div className="login-links">
          <button className="link-button">שכחת סיסמה?</button>
          <button className="link-button" onClick={() => {
            onClose();
            onSwitchToRegister();
          }}>
            הרשם
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;

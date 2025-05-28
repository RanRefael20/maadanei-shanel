// src/login/LoginSuccessModal.jsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./LoginSuccessModal.css";

const LoginSuccessModal = ({ username, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000); // סוגר אוטומטית אחרי 3 שניות
    return () => clearTimeout(timer);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className="login-success-overlay">
      <div className="login-success-modal">
        <p>שלום {username}, התחברת בהצלחה! 🎉</p>
      </div>
    </div>,
    document.body
  );
};

export default LoginSuccessModal;

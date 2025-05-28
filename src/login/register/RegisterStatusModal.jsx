import React from "react";
import ReactDOM from "react-dom";
import "./RegisterStatusModal.css";

const RegisterStatusModal = ({ status, onClose }) => {
  const getTitle = () => {
    if (status === "loading") return "...שולח נתונים";
    if (status === "success") return " ! נרשמת בהצלחה";
    return "";
  };

  const getMessage = () => {
    if (status === "loading") return ". אנא המתן לסיום התהליך";
    if (status === "success") return " ההרשמה בוצעה בהצלחה ! ברוך הבא";
    return "";
  };

  return ReactDOM.createPortal(
    <div className="status-overlay">
      <div className="status-modal">
        <button className="status-close-button" onClick={onClose}>✖</button>
        <h2 className={`status-title ${status}`}>{getTitle()}</h2>
        <p className="status-message">{getMessage()}</p>
      </div>
    </div>,
    document.body
  );
};

export default RegisterStatusModal;

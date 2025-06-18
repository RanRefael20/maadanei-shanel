import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./RegisterModal.css";
import RegisterErrorModal from "../Eror/RegisterErrorModal";
import RegisterStatusModal from "./RegisterStatusModal";
import { baseURL } from "..//./../config"; // או הנתיב המתאים אצלך
import LoadingSpinner from "../../componnents/LoadingSpinner";

const RegisterModal = ({ onClose, onSwitchToLogin, handleLoginSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    birthdate: "",
    address: "",
  });

  const [showError, setShowError] = useState(false);
  const [statusModal, setStatusModal] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    
    setStatusModal("loading");
    setShowError(false);
    setErrorMessage("");
    console.log("📦 נתונים שנשלחים להרשמה:", formData);

    try {
      const res = await fetch(`${baseURL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

    
      // 🎉 הצלחה — המשתמש מקבל טוקן ונשמר מיד
      localStorage.setItem("token", data.token);
localStorage.setItem("username", data.username); // ⬅️ חובה

      if (!res.ok) {
        if (res.status === 409 || res.status === 400) {
          setErrorMessage(data.message || "שגיאה כללית בהרשמה");
          setShowError(true);
          setStatusModal("");
          return;
        }

        alert(data.message || "שגיאה לא צפויה");
        setStatusModal("");
        return;
      }


      if (handleLoginSuccess) handleLoginSuccess(data.username, data.token);

      setStatusModal("success");

      setTimeout(() => {
        setStatusModal("");
        onClose();
      }, 4500);
    } catch (err) {
      console.error("❌ שגיאה:", err);
      alert("שגיאה בתקשורת עם השרת.");
      setStatusModal("");
    }
          setTimeout(() => {
 // window.location.reload();
}, 4500); // 10 שניות = 10,000 מילישניות
  };

  return ReactDOM.createPortal(
    <div className="register-overlay">
      {showError && (
        <RegisterErrorModal
          onClose={() => setShowError(false)}
          errorMessage={errorMessage}
        />
      )}
      {statusModal && (
        <RegisterStatusModal
          status={statusModal}
          onClose={() => {
            setStatusModal("");
            if (statusModal === "success") onClose();
          }}
        />
      )}
      <div className="register-modal">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2 className="register-title">הרשמה</h2>

        <input
          name="username"
          type="text"
          placeholder="שם משתמש"
          className="register-input"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="סיסמה"
          className="register-input"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="אימייל"
          className="register-input"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="phone"
          type="phone"
          placeholder="טלפון"
          className="register-input"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          name="address"
          type="text"
          placeholder="כתובת"
          className="register-input"
          value={formData.address}
          onChange={handleChange}
        />
        <input
          name="birthdate"
          type="date"
          className="register-input"
          value={formData.birthdate}
          onChange={handleChange}
        />

        <button className="menu-action-button" onClick={handleSubmit}>שלח הרשמה</button>

        <div className="register-links">
          <button
            className="link-button"
            onClick={() => {
              onClose();
              setTimeout(() => {
                onSwitchToLogin();
              }, 100);
            }}
          >
            כבר רשום? התחבר
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RegisterModal;

import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./RegisterModal.css";
import RegisterErrorModal from "../Eror/RegisterErrorModal";
import RegisterStatusModal from "./RegisterStatusModal";
import { baseURL } from "..//./../config"; // או הנתיב המתאים אצלך



const RegisterModal = ({ onClose, onSwitchToLogin }) => {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    birthdate: ""
  });

  const [showError, setShowError] = useState(false);
  const [statusModal, setStatusModal] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    console.log("📦 נתוני הרשמה:", formData);
    setStatusModal("loading");
    setShowError(false);

    try {
      const res = await fetch(`${baseURL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setShowError(true);
          setStatusModal("");
          return;
        }
        alert(data.message || "שגיאה לא צפויה");
        setStatusModal("");
        return;
      }

      console.log("✔️ הצלחה:", data);
      setStatusModal("success");

      setTimeout(() => {
        setStatusModal("");
        onClose();
      }, 6000);

    } catch (err) {
      console.error("❌ שגיאה:", err);
      alert("שגיאה בתקשורת עם השרת.");
      setStatusModal("");
    }
  };

  return ReactDOM.createPortal(
    <div className="register-overlay">
      {showError && <RegisterErrorModal onClose={() => setShowError(false)} />}
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

        <input name="username" type="text" placeholder="שם משתמש" className="register-input" value={formData.username} onChange={handleChange} />
        <input name="password" type="password" placeholder="סיסמה" className="register-input" value={formData.password} onChange={handleChange} />
        <input name="email" type="email" placeholder="אימייל" className="register-input" value={formData.email} onChange={handleChange} />
        <input name="phone" type="tel" placeholder="טלפון" className="register-input" value={formData.phone} onChange={handleChange} />
        <input name="birthdate" type="date" className="register-input" value={formData.birthdate} onChange={handleChange} />

        <button className="submit-button" onClick={handleSubmit}>שלח הרשמה</button>

        <div className="register-links">
          <button className="link-button" onClick={() => {
            onClose();
            setTimeout(() => {
              onSwitchToLogin();
            }, 100);
          }}>
            כבר רשום? התחבר
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RegisterModal;

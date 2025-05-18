// RegisterModal.jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./RegisterModal.css";

const RegisterModal = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    birthdate: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
     console.log("📦 !!!!!!!!!נתוני הרשמה לפני שליחה:", formData); // תדפיס
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      console.log("נרשם בהצלחה:", data);
      onClose(); // סגירת המודאל אחרי שליחה
    } catch (err) {
      console.error("שגיאה בשליחה:", err);
    }
  };

  return ReactDOM.createPortal(
    <div className="register-overlay">
      <div className="register-modal">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2 className="register-title">הרשמה</h2>

<input name="username" type="text" className="register-input" placeholder="שם משתמש" value={formData.username} onChange={handleChange} />
<input name="password" type="password" className="register-input" placeholder="סיסמה" value={formData.password} onChange={handleChange} />
<input name="email" type="email" className="register-input" placeholder="אימייל" value={formData.email} onChange={handleChange} />
<input name="phone" type="tel" className="register-input" placeholder="מספר טלפון" value={formData.phone} onChange={handleChange} />
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

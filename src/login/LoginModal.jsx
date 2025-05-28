import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./LoginModal.css";
import { baseURL } from "../config"; // או הנתיב המתאים אצלך


const LoginModal = ({ onClose, onSwitchToRegister, onLoginSuccess }) => {



  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setErrorMessage("");

    try {
      const res = await fetch(`${baseURL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "שגיאה בהתחברות");
        return;
      }

      if (!data.token) {
        setErrorMessage("❌ טוקן לא התקבל מהשרת");
        console.error("❌ שגיאה: התשובה מהשרת לא כללה token:", data);
        return;
      }

      // ✅ שמירת הטוקן
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);


      // ✅ עדכון המשתמש למעלה
      onLoginSuccess(data.username);

    } catch (err) {
      console.error("❌ שגיאה בתקשורת עם השרת:", err);
      setErrorMessage("שגיאה בתקשורת עם השרת");
    }
  };

  return ReactDOM.createPortal(
    <div className="login-overlay">
      <div className="login-modal">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2 className="login-title">התחברות</h2>

        <input
          type="email"
          name="email"
          placeholder="אימייל"
          className="login-input"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="סיסמה"
          className="login-input"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
        />

        {errorMessage && (
          <div className="login-error">{errorMessage}</div>
        )}

        <button className="submit-button" onClick={handleSubmit}>
          התחבר
        </button>

        <div className="login-links">
          <button className="link-button">שכחת סיסמה?</button>
          <button
            className="link-button"
            onClick={() => {
              onClose();
              onSwitchToRegister();
            }}
          >
            הרשם
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;

import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./LoginModal.css";
import { baseURL } from "../config";
import LoadingSpinner from "../componnents/LoadingSpinner";
import useAuthSync from "../hooks/useAuthSync"; // ✅ חדש

const LoginModal = ({ onClose, onSwitchToRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { setUser } = useAuthSync(); // ✅ חדש

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setIsProcessing(true);

    try {
      const res = await fetch(`${baseURL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("❌ שגיאת שרת:", data.message);
        setErrorMessage(data.message);
        setIsProcessing(false);
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error("Server returned non-JSON: " + text);
      }

      const data = await res.json();

      if (!data.success) {
        setErrorMessage(data.message || "שגיאה לא צפויה");
        setIsProcessing(false);
        return;
      }

      if (!data.token) {
        setErrorMessage("❌ טוקן לא התקבל מהשרת");
        console.error("❌ שגיאה: התשובה מהשרת לא כללה token:", data);
        setIsProcessing(false);
        return;
      }

      localStorage.setItem("token", data.token); // ⬅️ רק הטוקן
     // localStorage.setItem("username", data.username); 
setUser({  _id: data._id,  username: data.username,  email: data.email,  phone: data.phone,  address: data.address,  birthdate: data.birthdate,
});      onLoginSuccess(data.username, data.token); // ⬅️ להשאיר אם צריך למודאלים

    } catch (err) {
      console.error("❌ שגיאה בתקשורת עם השרת:", err);
      setErrorMessage("שגיאה בתקשורת עם השרת");
    } finally {
      setIsProcessing(false);
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

        {isProcessing ? (
          <LoadingSpinner text="... טוען" />
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;

import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./LoginModal.css";
import { baseURL } from "../config"; // או הנתיב המתאים אצלך
import LoadingSpinner from "../componnents/LoadingSpinner";



const LoginModal = ({ onClose, onSwitchToRegister, onLoginSuccess }) => {



  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // <-- מצב טעינה

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async () => {
  setErrorMessage("");
   setIsProcessing(true); // טעינת מסך 

  try {

    const res = await fetch(`${baseURL}/api/login`, {
      
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });



    // נבדוק קודם אם הקוד תקין
  if (!res.ok) {
  const data = await res.json(); // שים לב – כאן אתה מקבל את ה־message
  console.error("❌ שגיאת שרת:", data.message);
  setErrorMessage(data.message ); // <-- משתמש בהודעת השגיאה מהשרת
  setIsProcessing(false);
  return;
}


    // ננסה לפרש את התגובה כ־JSON רק אם res.ok
    const data = await res.json();

    if (!data.token) {
      setErrorMessage("❌ טוקן לא התקבל מהשרת");
      console.error("❌ שגיאה: התשובה מהשרת לא כללה token:", data);
               setIsProcessing(false); // טעינת מסך 

      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
onLoginSuccess(data.username, data.token);
    

  } catch (err) {
    console.error("❌ שגיאה בתקשורת עם השרת:", err);
    setErrorMessage("שגיאה בתקשורת עם השרת");
  } finally {
    setIsProcessing(false); 
  } // <-- זה הסוגר של הפונקציה
}; // <-- שים לב שהפונקציה מסתיימת כאן


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
          <div className="login-error">{errorMessage }</div>
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

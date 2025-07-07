import React, { useState } from "react";
import { baseURL } from "../config";
import RegisterErrorModal from "../login/Eror/RegisterErrorModal";
import LoadingSpinner from "../componnents/LoadingSpinner";
import LoginSuccessModal from "../login/success/LoginSuccessModal";
import "./ForgotPassword.css";



const ForgotPassword = ({onClose}) => {
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`${baseURL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setIsProcessing(false);

      if (res.ok) {
        setShowSuccess(true);
        setIsProcessing(false)
      } else {
        setErrorMessage(data.message || "אירעה שגיאה");
        setShowError(true);
        setIsProcessing(false)
      }
    } catch (err) {
      setIsProcessing(false);
      setErrorMessage("שגיאה בשרת");
      setShowError(true);
      setIsProcessing(false)
    }
  };

  return (
<div className="forgot-password-overlay-unique">
  <div className="forgot-password-modal-unique">
    <button className="forgot-password-close-button-unique" onClick={onClose}>✖</button>
    <h2 className="forgot-password-title-unique">? שכחת סיסמא</h2>
<p className="p-uniqe">כתובת מייל</p>
    <input
      type="email"
      placeholder="הזן את כתובת המייל שלך"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="forgot-password-input-unique"
    />

    <button
      className="forgot-password-button-unique"
      onClick={handleForgotPassword}
    >
      איפוס סיסמה
    </button>




{isProcessing &&(
  <LoadingSpinner/>
)}

    {showError && (
      <RegisterErrorModal
        onClose={() => setShowError(false)}
        errorMessage={errorMessage}
      />
    )}
    {showSuccess && (
      <LoginSuccessModal
        onClose={() => setShowSuccess(false)}
        message="הסיסמה הזמנית שלך למעדני שנאל נשלחה בהצלחה ✨  
התחבר כעת עם הסיסמה מהמייל, ועדכן סיסמה קבועה להגנה מלאה.
"
      />
    )}
  </div>
</div>
  );
};

export default ForgotPassword;

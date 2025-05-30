import React, { useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./register/RegisterModal";
import LoginSuccessModal from "../login/success/LoginSuccessModal"; // אם התיקייה שלך היא login

const AuthManager = ({ onLoginSuccess }) => {
  const [activeModal, setActiveModal] = useState(null); // 'login' | 'register' | null
  const [username, setUsername] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  

const handleLoginSuccess = (name) => {
  setUsername(name);
  onLoginSuccess(name); // מעדכן את NavBar
  setShowSuccessModal(true); // פותח מודאל התחברות
  setTimeout(() => {
    setActiveModal(null); // סגור את מודאל ההתחברות
    setShowSuccessModal(false); // סגור את מודאל ההצלחה
  }, 3000);
};

  return (
    <>
      {!username && (
        <button className="login-button" onClick={() => setActiveModal("login")}>
          התחברות
        </button>
      )}



      {activeModal === "login" && (
        <LoginModal
          onClose={() => setActiveModal(null)}
          onSwitchToRegister={() => {
            setActiveModal(null);
            setTimeout(() => setActiveModal("register"), 100);
          }}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {activeModal === "register" && (
        <RegisterModal
          onClose={() => setActiveModal(null)}
          onSwitchToLogin={() => {
            setActiveModal(null);
            setTimeout(() => setActiveModal("login"), 100);
          }}
        />
      )}

{showSuccessModal && (
  <LoginSuccessModal
    username={username}
    onClose={() => setShowSuccessModal(false)}
  />
)}



    </>
  );
};

export default AuthManager;

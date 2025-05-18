import React, { useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const AuthManager = () => {
  const [activeModal, setActiveModal] = useState(null); // 'login' | 'register' | null

  const handleOpenLogin = () => setActiveModal("login");
  const handleOpenRegister = () => setActiveModal("register");
  const handleClose = () => setActiveModal(null);

  return (
    <>
      <button className="login-button" onClick={handleOpenLogin}>
        התחברות
      </button>

{activeModal === "login" && (
  <LoginModal
    onClose={handleClose}
    onSwitchToRegister={() => {
      setActiveModal(null);
      setTimeout(() => setActiveModal("register"), 100);
    }}
  />
)}

{activeModal === "register" && (
  <RegisterModal
    onClose={handleClose}
    onSwitchToLogin={() => {
      setActiveModal(null);
      setTimeout(() => setActiveModal("login"), 100);
    }}
  />
)}


    </>
  );
};

export default AuthManager;

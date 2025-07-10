import React, { useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./register/RegisterModal";
import ForgotPassword from "../login/ForgotPassword"; // אם התיקייה שלך היא login
import useAuthSync from "../hooks/useAuthSync"; // ✅
import UsersModal from "../Admin/UsersModal"; // או הנתיב שלך בפועל



const AuthManager = ({  activeModal,  setActiveModal, onLoginSuccess , setShowMyOrders    }) => {
  const { checkToken } = useAuthSync(); // ✅ שלוף את הפונקציה

  

  /* פותח לי הרשמה דרך התפריטים שרשמת במצב לא מחובר  */
const switchToRegisterViaModal = () => {
  setActiveModal(null);
  setTimeout(() => setActiveModal("register"), 100);
};


const handleLoginSuccess = async (name, token) => {
  if (token) {
    localStorage.setItem("token", token);
  }

  await checkToken(); // ✅ זה יביא את כל הנתונים של המשתמש

  if (onLoginSuccess) {
    onLoginSuccess(); // 🟡 לא צריך להעביר רק את השם, כי checkToken כבר עדכן את המשתמש
  }

  setTimeout(() => {
    setActiveModal(null);
  }, 3000);
};


const openForgotPassword = () => setActiveModal("forgot");

  return (
    <>



            {activeModal === "login" && (
        <LoginModal
setShowMyOrders={setShowMyOrders}
        onClose={() => setActiveModal(null)}
          onSwitchToRegister={switchToRegisterViaModal}
          handleLoginSuccess={handleLoginSuccess}
           onForgotPassword={openForgotPassword} // ⬅️ חשוב!

        />
      )}

   

      {activeModal === "register" && (
  <RegisterModal
  onClose={() => setActiveModal(null)}
  onSwitchToLogin={() => {
    setActiveModal(null);
    setTimeout(() => setActiveModal("login"), 100);
  }}
  handleLoginSuccess={handleLoginSuccess} // ⬅️ חדש!
/>
      )}

      {activeModal === "forgot" && (
  <ForgotPassword onClose={() => setActiveModal(null)} />
)}



{activeModal === "users" && (
  <UsersModal
    onClose={() => setActiveModal(null)}
    setActiveModal={setActiveModal}
  />
)}






    </>
  );
};

export default AuthManager;

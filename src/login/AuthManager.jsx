import React, { useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./register/RegisterModal";
import LoginSuccessModal from "../login/success/LoginSuccessModal"; // אם התיקייה שלך היא login
import SavedMenus from "../SavedMenus/SavedMenus";


const AuthManager = ({ username ,  activeModal,  setActiveModal, onLoginSuccess }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSavedMenus, setShowSavedMenus] = useState(false);

  

  /* פותח לי הרשמה דרך התפריטים שרשמת במצב לא מחובר  */
const switchToRegisterViaModal = () => {
  setActiveModal(null);
  setTimeout(() => setActiveModal("register"), 100);
};


const handleLoginSuccess = (name, token) => {
  if (token) {
    localStorage.setItem("token", token);
    
  }

  if (onLoginSuccess) {
    onLoginSuccess(name);
  }

  setShowSuccessModal(true);
  setTimeout(() => {
    setActiveModal(null);
    setShowSuccessModal(false);
  }, 3000);
};



  return (
    <>


      {username && (
        <div className="logged-in-name">
          {/* שם המשתמש מוצג כבר ב־NavBar דרך props */}
        
        </div>
      )}

  

            {activeModal === "login" && (
        <LoginModal
          onClose={() => setActiveModal(null)}
          onSwitchToRegister={switchToRegisterViaModal}
          handleLoginSuccess={handleLoginSuccess}
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

{showSuccessModal && (
  <LoginSuccessModal
    username={username}
    onClose={() => setShowSuccessModal(false)}
  />
)}

<SavedMenus
  isOpen={showSavedMenus}
  onClose={() => setShowSavedMenus(false)}
  onLoadMenu={(loadedMenu) => {
    setShowSavedMenus(false);
    setShowResults(true);
    setResults([{ ...loadedMenu }]);
  }}
  onSwitchToRegister={switchToRegisterViaModal} // ✅ חובה!
/>





    </>
  );
};

export default AuthManager;

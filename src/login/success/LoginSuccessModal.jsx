// src/login/LoginSuccessModal.jsx
import  { useEffect } from "react";
import ReactDOM from "react-dom";
import "./LoginSuccessModal.css";

const LoginSuccessModal = ({ username, onClose, message , autoClose = true   , setShowSavedMenus , }) => {
  useEffect(() => {
    if (!autoClose) return; // ❌ אל תפעיל טיימר אם מבוטל

    const timer = setTimeout(onClose, 10000);
    return () => clearTimeout(timer);
  }, [autoClose, onClose]);

  return ReactDOM.createPortal(
<div className="login-success-overlay">
  <div className="login-success-modal">
    {!autoClose && (
      <button className="close-button" onClick={onClose}>✖</button>
    )}
    <p>{message || `שלום ${username}, התחברת בהצלחה! 🎉`}</p>
         {!autoClose && (
     <button className="extra-button"
     onClick={()=>{  
      setShowSavedMenus(true)
      onClose();
     }
     }
     >
            התפריטים שלי
          </button>
      )}
  </div>
</div> ,
    document.body
  );
};

export default LoginSuccessModal;

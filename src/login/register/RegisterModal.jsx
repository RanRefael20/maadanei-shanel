import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./RegisterModal.css";
import RegisterErrorModal from "../Eror/RegisterErrorModal";
import RegisterStatusModal from "./RegisterStatusModal";
import { baseURL } from "..//./../config"; // או הנתיב המתאים אצלך
import LoadingSpinner from "../../componnents/LoadingSpinner";
import useAuthSync from "../../hooks/useAuthSync"; // מסלול נכון

const RegisterModal = ({ onClose, onSwitchToLogin, handleLoginSuccess }) => {
    const { checkToken } = useAuthSync(); // ✅ נוסיף את זה

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    birthdate: "",
    address: "",
  });



  /* אימות  */
    const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verified, setVerified] = useState(false);
/*  */

  const [showError, setShowError] = useState(false);
  const [statusModal, setStatusModal] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

    // שלח קוד אימות למייל
  const handleSendOTP = async () => {
    setMessage("שולח קוד אימות למייל...")
      setErrorMessage("");
          setShowError(false);
    if (!formData.email){
          setMessage("")
          setErrorMessage("יש להזין כתובת מייל");
          setShowError(true);
      return 
    } 

    try {
      const res = await fetch(`${baseURL}/api/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (res.ok) {
    setMessage( "📧 קוד אימות נשלח למייל שלך")
        setOtpSent(true);
      } else {
        setMessage("")
        setErrorMessage(data.message || "שגיאה בשליחת קוד");
       setShowError(true);
       return
        }
    } catch (err) {
      setMessage("")
  setErrorMessage("שגיאה בתקשורת עם השרת");
    setShowError(true); 
         }
  };

    // אמת את הקוד שהוזן
  const handleVerifyCode = async () => {
      setMessage( "מאמת...")
      setErrorMessage("");
       setShowError(false);
    try {
      const res = await fetch(`${baseURL}/api/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: otpCode }),
      });

      const data = await res.json();
      if (res.ok) {
          setMessage( "✅ הקוד אומת בהצלחה!")
        setVerified(true);
        

      } else {
        setMessage("")
          setErrorMessage(data.message || "קוד שגוי");
          setShowError(true);
      }
    } catch (err) {
    setMessage("")
   setErrorMessage( "שגיאה בעת אימות הקוד");
          setShowError(true);    
        }
  };

  const handleSubmit = async () => {
        setMessage("שולח נתונים...")
  if (!verified){
     setMessage("")
   setErrorMessage( "יש לאמת את המייל לפני השלמת ההרשמה ");
          setShowError(true);  
  }

    setStatusModal("loading");
    setShowError(false);
    setErrorMessage("");
    console.log("📦 נתונים שנשלחים להרשמה:", formData);

    try {
      const res = await fetch(`${baseURL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
       setMessage("")
        if (res.status === 409 || res.status === 400) {
          setErrorMessage(data.message || "שגיאה כללית בהרשמה");
          setShowError(true);
          setStatusModal("");
          return;
        }
     setErrorMessage("שגיאה לא צפויה");
    setShowError(true); 
       setStatusModal("");
        return;
      }


if (res.ok) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("username", data.username);

  await checkToken(); // ⬅️ שורת הקסם

  if (handleLoginSuccess) handleLoginSuccess(data.username, data.token);
}

      setStatusModal("success");

      setTimeout(() => {
        setStatusModal("");
        onClose();
      }, 4500);
    } catch (err) {
      setMessage("")
      console.error("❌ שגיאה:", err);
 setErrorMessage( "שגיאה בתקשורת עם השרת");
setShowError(true);
   setStatusModal("");
    }
          setTimeout(() => {
 // window.location.reload();
}, 4500); // 10 שניות = 10,000 מילישניות
  };

  return ReactDOM.createPortal(
    <div className="register-overlay">
      {showError && (
        <RegisterErrorModal
          onClose={() => setShowError(false)}
          errorMessage={errorMessage}
        />
      )}
      {statusModal && (
        <RegisterStatusModal
          status={statusModal}
          onClose={() => {
            setStatusModal("");
            if (statusModal === "success") onClose();
          }}
        />
      )}

            {message && (
        <LoadingSpinner result={message} setMessage={setMessage} />
      )}
      <div className="register-modal">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2 className="register-title">הרשמה</h2>

        <input
          name="username"
          type="text"
          placeholder="שם משתמש"
          className="register-input"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="סיסמה"
          className="register-input"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="אימייל"
          className="register-input"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="phone"
          type="phone"
          placeholder="טלפון"
          className="register-input"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          name="address"
          type="text"
          placeholder="כתובת"
          className="register-input"
          value={formData.address}
          onChange={handleChange}
        />
      להטבות יום הולדת🤩
        <input
          name="birthdate"
          type="date"
          className="register-input"
          value={formData.birthdate}
          onChange={handleChange}
        />


{verified && (
  <>
  <div className="confirmation-message">
    ✅ רגע לפני הסיום:
    <br />
    אנא ודא שכל הפרטים שהזנת נכונים.
    <br />
    לאחר מכן, לחץ על <strong>"שלח הרשמה"</strong> כדי לסיים את התהליך.
  </div>
        <button className="menu-action-button" onClick={handleSubmit}>שלח הרשמה</button>
</>
)}  


        {!otpSent && (
        <button className="menu-action-button" onClick={handleSendOTP}>שלח קוד אימות למייל</button>
  ) } 

        {!verified && otpSent && (
          <>
            <input
              type="text"
              placeholder="הזן את קוד האימות שקיבלת"
              className="register-input"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
            />
       
   <button className="menu-action-button" onClick={handleVerifyCode}>
              אמת קוד
            </button>
            <button className="menu-action-button" onClick={handleSendOTP}>שלח שוב</button>

          </>
        )}




        <div className="register-links">
          <button
            className="link-button"
            onClick={() => {
              onClose();
              setTimeout(() => {
                onSwitchToLogin();
              }, 100);
            }}
          >
            כבר רשום? התחבר
          </button>
        </div>
        
      </div>
      
    </div>,
    document.body
  );
};

export default RegisterModal;

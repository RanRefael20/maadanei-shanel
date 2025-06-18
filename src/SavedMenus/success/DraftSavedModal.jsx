import { useState } from "react";
import ReactDOM from "react-dom";
import "../success/DraftSavedModal.css";
import LoadingSpinner from "../../componnents/LoadingSpinner";
  import useAuthSync from "../../hooks/useAuthSync"; // ✅ ייבוא חסר
  import { baseURL } from "../../config";
import RegisterErrorModal from "../../login/Eror/RegisterErrorModal";
import LoginSuccessModal from "../../login/success/LoginSuccessModal";





const DraftSavedModal = ({ onClose , results  }) => {
  const [draftName, setDraftName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ חדש

const { user } = useAuthSync();


    /* שמירת טפריט */
const handleSaveDraft = async ({results , draftName  }) => {
if (!user?._id) {
  setErrorMessage("כדי לשמור תפריט יש להרשם או להתחבר קודם .")
  setShowSuccess(false); // סגור את מודל ההצלחה
  setShowErrorModal(true);
  return false;
}

const payload = {
  name: draftName, // ✅ חשוב מאוד
items: (results[0]?.items || []).map(item => ({
  name: String(item.name),
  price: Number(item.price),
category: String(item.category)
})),
  total: results[0]?.total || 0,
};


  if (!payload.items.length) {
    setErrorMessage("אי אפשר לשמור תפריט ריק .")
      setShowErrorModal(true);

    return false;
  }

  try {
    const res = await fetch(`${baseURL}/api/savedMenus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload)
    });
  const text = await res.text();
  const data = JSON.parse(text);

  if (!res.ok) {
    // תצוגה של שגיאות ולידציה
    if (res.status === 400 && data.errors) {
      setErrorMessage(data.errors.join("\n"));
    } else {
      setErrorMessage(data.message || "שגיאה בשמירה");
    }
    setShowErrorModal(true);
    return false;
  }

  return true;

} catch (err) {
  setErrorMessage("שגיאה כללית בשרת");
  setShowErrorModal(true);
  return false;
}
};



const handleSave = async () => {

if (!draftName.trim()) return;
  setIsProcessing(true);

  try {
    const success = await handleSaveDraft({results , draftName}); // 🧠 עכשיו מקבל true / false
if (success) {
  setShowSuccess(true);
  // בלי שום setTimeout פה
}


  } catch (err) {
setErrorMessage(String(err));
  setShowSuccess(false); // סגור את מודל ההצלחה
  setShowErrorModal(true);
  } finally {
    setIsProcessing(false);
  }
};





  return ReactDOM.createPortal(
    <div className="draft-saved-overlay">
      <div className="draft-saved-modal">
 {isProcessing ? (
  <div className="draft-saved-overlay">
    <LoadingSpinner text="... שומר תפריט" />
  </div>
) : (
        <>
        <h2>💾 שמירת טיוטה</h2>
        <p>הזן שם , תאריך האירוע וכו , זה יעזור לך למצוא את התפריט בעת חיפוש</p>

        <input
          type="text"
          placeholder="הזן שם לתפריט"
          onChange={(e) => setDraftName(e.target.value)}
          className="draft-name-input"
        />

        <div className="draft-saved-buttons">
<button className="confirm-button" onClick={handleSave}>
            שמור טיוטה
          </button>
          <button className="close-button" onClick={onClose}>
            ביטול
          </button>
         </div>
        </>
      )}

    </div>
     
    {showSuccess && (
  <LoginSuccessModal
    username="🙂"
    message={`💾 ! התפריט ${draftName} נשמר בהצלחה `}
   autoClose={false} // ⛔️ לא יסגר אוטומטית
    onClose={() => {
      setShowErrorModal(false); // נקה את השני
      setShowSuccess(false);
      onClose();
    }}
   

  />
)}

{showErrorModal && (
  <RegisterErrorModal
  message={errorMessage} 
     onClose={() => setShowErrorModal(false)}
  />
)}


  </div>,
  
    
    document.body

  );
};

export default DraftSavedModal;

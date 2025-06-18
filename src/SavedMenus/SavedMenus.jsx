import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "../SavedMenus/SavedMenus.css";
import { baseURL } from "../config";
import useAuthSync from "../hooks/useAuthSync"; // ✅ ייבוא חסר
import LoadingSpinner from "../componnents/LoadingSpinner";
import RegisterErrorModal from "../login/Eror/RegisterErrorModal";



const SavedMenus = ({ isOpen, onClose, onLoadMenu, onSwitchToRegister ,openBudgetChat , user , draftId,  setDraftId  }) => {
  const [savedMenus, setSavedMenus] = useState([]);
  const [menusCount, setMenusCount] = useState(0);//מספר שמורים
 const {loading , setLoading } = useAuthSync();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ חדש
const [IdmenuToDelete, setIdMenuToDelete] = useState(null); // מחזיק את ID למחיקה





useEffect(() => {
  if (isOpen && user) {
    fetchMenus(); // טוען את הטיוטות של המשתמש החדש
        fetchSavedMenusCount().then(setMenusCount); // טוען את הכמות

  } else if (isOpen && !user) {
    setSavedMenus([]); // ✅ מנקה את הטיוטות של המשתמש הקודם בהתנתקות
     setMenusCount(0); // אפס ספירה
  }
}, [isOpen, user]); // ✅ גם user וגם isOpen בתלויות



const fetchMenus = async () => {
    setLoading(true); // ⬅️ התחלת טעינה

  try {
    const res = await fetch(`${baseURL}/api/savedmenus/${user._id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();
    


      if (!res.ok) {
        setErrorMessage(data.message || "שגיאה בטעינת טיוטות");
        setShowErrorModal(true);
        setSavedMenus([]);
        return;
      }

     if (!Array.isArray(data)) {
        setErrorMessage("המידע שהתקבל אינו תקין.");
        setShowErrorModal(true);
        setSavedMenus([]);
        return;
      }


    setSavedMenus(data);
    } catch (err) {
      setErrorMessage("שגיאה כללית בטעינת הטיוטות");
      setShowErrorModal(true);
      setSavedMenus([]);
    } finally {
      setLoading(false);
    }
  };

/* קבלת מספר השמורים */
const fetchSavedMenusCount = async () => {
  try {
    const res = await fetch(`${baseURL}/api/savedMenus/count`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    console.log("✅ כמות תפריטים שמורים:", data.count);
    return data.count;
  } catch (err) {
    console.error("❌ שגיאה בקבלת כמות תפריטים", err);
    return 0;
  }
};





const handleLoad = async (menuId) => {
  try {
    const res = await fetch(`${baseURL}/api/savedmenus/single/${menuId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ זה היה חסר
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "שגיאה בטעינת הטיוטה");
    }

    onLoadMenu(data);
    setDraftId(menuId); // ✅ העבר את ה־ID לרזולט
    onClose();
  } catch (err) {
    setErrorMessage(err.message || "שגיאה בטעינת הטיוטה");
    setShowErrorModal(true);
  }
};

  if (!isOpen) return null;



  /* פונקציית מחיקה */
  const handleDeleteMenu = async (menuId) => {


const token = localStorage.getItem("token");
if (!token) {
  setErrorMessage(".יש להתחבר או להרשם")
  setShowErrorModal(true);
  return false;
}
  try {
    const res = await fetch(`${baseURL}/api/savedMenus/delete/${menuId}`, {
         method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
 

    // הסרה מהתצוגה
setSavedMenus((prev) => {
  const updated = prev.filter((m) => m._id !== menuId);
  setMenusCount(updated.length); // ← כאן מתבצע העדכון
  return updated;
});

} catch (err) {
  setErrorMessage("שגיאה כללית בשרת");
  setShowErrorModal(true);
  return false;
  }
};



return createPortal(
  <div className="saved-menus-overlay">
    <div className="saved-menus-modal">
      <div className="saved-menus-header">
<h2>📂 תפריטים ששמרת ({menusCount})</h2>
        <button className="saved-menus-close-btn" onClick={onClose}>✖</button>

      </div>

      <ul className="savedmenus-list">
        <>

        { !user ? (
          <ul className="empty-message"><li>🔒 עליך להתחבר כדי לראות את התפריטים שלך.</li>
          <li>אם עדיין לא נרשמתה⬅️<button
                className="link-button"
                onClick={() => {
                  onClose();
                  onSwitchToRegister();
                }}
              >לחץ כאן להרשמה בחינם וקבל מלא הטבות !
              </button></li>
              <li>לאחר הרשמה תוכל לשמור לעצמך תפריטים.</li>
              </ul>
              ) : loading ? (
            <LoadingSpinner text="טוען..." />
        ) : savedMenus.length === 0 ? (
          <li className="empty-message">אין עדיין תפריטים שמורים .
          <button  className="chat-button"
  onClick={() => {
    onClose(); // סוגר את המודל הזה
    openBudgetChat(); // פותח את BudgetChat מ־NavBar
  }}
>
  בנה תפריט אישי
  
</button>

          </li>
          
          
        ) : (
savedMenus.map((menu, index) => (
  <li key={menu._id} className="savedmenus-item">
    <span className="menu-serial">{index + 1}</span>
  <div className="menu-card">
    <div className="menu-info">
      <strong className="menu-title">📌 שם התפריט: {menu.name}</strong>
      <div className="menu-total">💰 תפריט על סך: {menu.total} ₪</div>
      <div className="menu-date">📅 נוצר ב־ {new Date(menu.createdAt).toLocaleDateString("he-IL")}</div>
    </div>
    <div className="menu-actions">
      <button onClick={() => handleLoad(menu._id)} className="load-button">פתח תפריט / עריכה</button>
<button
  className="delete-button"
  onClick={() => {
    setIdMenuToDelete(menu._id);                // שמור את המזהה
    setErrorMessage("?האם אתה בטוח רוצה למחוק את התפריט");
    setShowErrorModal(true);                  // פתח את המודל
  }}
>
  🗑️ מחק תפריט
</button>    </div>
  </div>
</li>


          ))
          
        )}
        
        </>
      </ul>
    </div>

    {showErrorModal && (
  <RegisterErrorModal
  IdmenuToDelete={  IdmenuToDelete}
    message={errorMessage}
    onClose={() => {
      setShowErrorModal(false);
      setIdMenuToDelete(null); // איפוס
    }}
    actions={[
      {
        label: "ביטול",
        onClick: () => {
          setShowErrorModal(false);
          setIdMenuToDelete(null);
        }
      },
      {
        label: "🗑️ מחק",
        onClick: async () => {
          setLoading(true); // ⬅️ התחלת טעינה
          setShowErrorModal(false);
  await handleDeleteMenu(IdmenuToDelete); // ✅ השתמש במזהה השמור
          setIdMenuToDelete(null);
          setLoading(false);
        }
      }
    ]}
  />
)}


  </div>,
  
  document.getElementById("modal-root")
);

};

export default SavedMenus;

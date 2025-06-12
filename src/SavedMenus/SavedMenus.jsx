import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "../SavedMenus/SavedMenus.css";
import { baseURL } from "../config";
import useAuthSync from "../hooks/useAuthSync"; // ✅ ייבוא חסר
import LoadingSpinner from "../componnents/LoadingSpinner";



const SavedMenus = ({ isOpen, onClose, onLoadMenu, onSwitchToRegister ,openBudgetChat , user  }) => {
  const [savedMenus, setSavedMenus] = useState([]);
        const {loading , setLoading } = useAuthSync();




useEffect(() => {
  if (isOpen && user) {
    fetchMenus(); // טוען את הטיוטות של המשתמש החדש
  } else if (isOpen && !user) {
    setSavedMenus([]); // ✅ מנקה את הטיוטות של המשתמש הקודם בהתנתקות
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
console.log("setSavedMenus([]);" , data);

    if (!res.ok) {
      console.error("❌ שגיאה מהשרת:", data.message);
      setSavedMenus([]); // או הצג שגיאה למשתמש
      return;
    }

    if (!Array.isArray(data)) {
      console.error("⚠️ המידע שהתקבל אינו מערך:", data);
      setSavedMenus([]);
      return;
    }

    setSavedMenus(data);
  } catch (err) {
    console.error("❌ שגיאה בטעינת טיוטות:", err);
    setSavedMenus([]);
      } finally {
    setLoading(false); // ⬅️ סיום טעינה
  
  } 
};


  const handleLoad = async (menuId) => {
    try {
      const res = await fetch(`${baseURL}/api/savedmenus/single/${menuId}`);
      const data = await res.json();
      onLoadMenu(data); // מעלה את הטיוטה ל־ResultsModal
      onClose(); // סוגר את המודל
    } catch (err) {
      console.error("❌ שגיאה בטעינת טיוטה:", err);
    }
  };

  if (!isOpen) return null;

  /* פונקציית מחיקה */
  const handleDeleteMenu = async (menuId) => {
  if (!window.confirm("האם אתה בטוח שברצונך למחוק את הטיוטה?")) return;

  try {
    const res = await fetch(`${baseURL}/api/savedMenus/delete/${menuId}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("שגיאה במחיקת הטיוטה");

    // הסרה מהתצוגה
setSavedMenus((prev) => prev.filter((m) => m._id !== menuId));
  } catch (err) {
    console.error("שגיאה במחיקה:", err);
    alert("❌ לא הצלחנו למחוק את הטיוטה");
  }
};



return createPortal(
  <div className="saved-menus-overlay">
    <div className="saved-menus-modal">
      <div className="saved-menus-header">
        <h2>📂 תפריטים ששמרת</h2>
        <button className="saved-menus-close-btn" onClick={onClose}>✖</button>

      </div>

      <ul className="savedmenus-list">
        <>
            {console.log("📦 savedMenus:", savedMenus)}

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
            <LoadingSpinner text="...טוען תפריטים " />
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
          savedMenus.map((menu) => (
            
  <li key={menu._id} className="savedmenus-item">
  <div className="menu-card">
    <div className="menu-info">
      <strong className="menu-title">📌 שם התפריט: {menu.name}</strong>
      <div className="menu-total">💰 תפריט על סך: {menu.total} ₪</div>
      <div className="menu-date">📅 נוצר ב־ {new Date(menu.createdAt).toLocaleDateString("he-IL")}</div>
    </div>
    <div className="menu-actions">
      <button onClick={() => handleLoad(menu._id)} className="load-button">פתח תפריט / עריכה</button>
      <button className="delete-button" onClick={() => handleDeleteMenu(menu._id)}>🗑️ מחק תפריט</button>
    </div>
  </div>
</li>

          ))
          
        )}
        
        </>
      </ul>

    </div>
  </div>,
  document.getElementById("modal-root")
);

};

export default SavedMenus;

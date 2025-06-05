import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "../SavedMenus/SavedMenus.css";
import { baseURL } from "../config";
import useAuthSync from "../hooks/useAuthSync"; // ודא שזה הנתיב הנכון אצלך

const SavedMenus = ({ isOpen, onClose, onLoadMenu }) => {
  const { user, loading: authLoading } = useAuthSync();
  const [savedMenus, setSavedMenus] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user?._id) {
      fetchMenus();
    }
  }, [isOpen, user]);

const fetchMenus = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${baseURL}/api/savedmenus/${user._id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

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
    setLoading(false);
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

  if (!isOpen || authLoading || !user) return null;

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
          <button className="close-button" onClick={onClose}>✖</button>
        </div>

        {loading ? (
          <p className="loading-text">⏳ טוען...</p>
        ) : (
          <ul className="savedmenus-list">
            {savedMenus.length === 0 ? (
              <li className="empty-message">אין עדיין טיוטות שמורות.</li>
            ) : (
              savedMenus.map((menu) => (
                <li key={menu._id} className="savedmenus-item">
                  <div className="menu-info">
                    <strong>{menu.name}</strong>
                     <button   className="delete-button"  onClick={() => handleDeleteMenu(menu._id)}>  🗑️ מחק</button>
                    <div>💰 סה"כ: {menu.total} ₪</div>
                    <div>📅 תאריך: {new Date(menu.createdAt).toLocaleDateString("he-IL")}</div>
              
               
                  </div>
                  <button onClick={() => handleLoad(menu._id)} className="load-button">טען</button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default SavedMenus;

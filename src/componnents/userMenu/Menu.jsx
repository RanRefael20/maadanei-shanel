import React, { useState, useEffect , useRef  } from "react";
import { createPortal } from "react-dom";
import "../../componnents/userMenu/Menu.css";
import useAuthSync from "../../hooks/useAuthSync"; // ✅ ייבוא חסר
import LoadingSpinner from "../LoadingSpinner";
import { FaUserCircle } from "react-icons/fa";




  const Menu = ({setShowBudgetChat , setShowSavedMenus , setShowSettingsPanel  ,  setActiveModal  }) => {
      const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);  
      const { user, setUser , loading , setLoading } = useAuthSync();

  

    /* לחיצה עם תפריט משתמש */
      useEffect(() => {
      const handleClickOutside = (event) => {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
          setShowUserMenu(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    /* לא עובד כרגע  */
/*       const handleGenerate = () => {
    // פונקציה לטעינה מחדש של התפריט
  }; */

  /* לא עובד  כרגע  */
/* const triggerDraftModal = (name) => {
  setDraftName(name);
  setShowDraftSaved(true);
  setTimeout(() => setShowDraftSaved(false), 3000);
}; */

  const handleLogout = () => {
    if (!user?.username) return;
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setUser(null);
      setLoading(false);
     // window.location.reload();
    }, 2000);
  };
     
    return(  
     <div
          className="user-menu-wrapper"
          ref={userMenuRef}
          onMouseEnter={() => setShowUserMenu(true)}
          onClick={() => setShowUserMenu(true)}
        >
          <FaUserCircle size={28} className="user-icon" />

          {showUserMenu && (
            <div className="user-menu">
<div className="user-menu-header">
  {user?.username ? (
    <>
      שלום, {user.username}
    </>
  ) : (
    <button
      className="user-menu-item"
      onClick={() => setActiveModal("login")}
    >
      התחברות
    </button>
  )}
</div>

              <button className="user-menu-item">ההזמנות שלי</button>
              <button className="user-menu-item" onClick={() => {
                            setShowBudgetChat(true); // פתח את BudgetChat
                                                         }} >צור תפריט אישי</button>
              <button className="user-menu-item" onClick={() => setShowSavedMenus(true)}>
                תפריטים ששמרת
              </button>
              <button className="user-menu-item"    onClick={() => {
    setShowSettingsPanel(true); // פתח את הגדרות
  }}>
 הגדרות משתמש  
              </button>
              <button className="user-menu-item">הנקודות שלי</button>
              {user?.username && (loading ? <LoadingSpinner text="... מתנתק" /> : <button className="user-menu-item logout" onClick={handleLogout}>התנתקות</button>)}
            </div>
          )}
        </div>
    );
        };
        export default Menu;
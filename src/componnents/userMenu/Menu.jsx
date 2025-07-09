import React, { useState, useEffect , useRef  } from "react";
import { createPortal } from "react-dom";
import "../../componnents/userMenu/Menu.css";
import LoadingSpinner from "../LoadingSpinner";
import { FaUserCircle } from "react-icons/fa";




  const Menu = ({setShowBudgetChat , setShowSavedMenus , setShowSettingsPanel  ,  setActiveModal  , user , loading , setLoading , setUser , setShowMyOrders}) => {
      const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);  
  const [expireDate, setExpireDate] = useState(null);

      
  const isMobile = window.innerWidth <= 768;
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth > 768) setShowUserMenu(false);
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


useEffect(() => {
  if (user?.lastOrderAt) {
    const date = new Date(user.lastOrderAt);
    date.setMonth(date.getMonth() + 3);
    setExpireDate(date);
  }
}, [user]);

    /* לחיצה עם תפריט משתמש */
      useEffect(() => {
const handleClickOutside = (event) => {
  const menuEl = document.querySelector(".user-menu");
  if (
    showUserMenu &&
    userMenuRef.current &&
    !userMenuRef.current.contains(event.target) &&
    menuEl &&
    !menuEl.contains(event.target)
  ) {
    setShowUserMenu(false);
  }
};


      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

useEffect(() => {
  let startX = 0;
  let currentX = 0;

  const handleTouchStart = (e) => {
    startX = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    currentX = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diffX = currentX - startX;

    if (diffX > 50 && showUserMenu) {
      // גרירה ימינה – סגור תפריט
      setShowUserMenu(false);
    } else if (diffX < -50 && !showUserMenu) {
      // גרירה שמאלה – פתח תפריט
      setShowUserMenu(true);
    }
  };

  window.addEventListener("touchstart", handleTouchStart);
  window.addEventListener("touchmove", handleTouchMove);
  window.addEventListener("touchend", handleTouchEnd);

  return () => {
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
  };
}, [showUserMenu]);

useEffect(() => {
  if (isMobile) {
    document.body.style.overflow = showUserMenu ? "hidden" : "auto";
  }
}, [showUserMenu]);


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
<>
  {/* ✅ רקע כהה ללחיצה מחוץ לתפריט */}
  {isMobile && showUserMenu && (
    <div className="menu-overlay" onClick={() => setShowUserMenu(false)} />
  )}

  {/* ✅ תפריט ואייקון */}
  <div
    className="user-menu-wrapper"
    ref={userMenuRef}
    onMouseEnter={() => setShowUserMenu(true)}
    onClick={() => setShowUserMenu(true)}
  >
    {/* ✅ כפתור ✖️ בנייד */}
<>
  {showUserMenu && (
    <button className="close-icon" onClick={() => setShowUserMenu(false)}>✖️</button>
  )}
  {!showUserMenu && (
    <FaUserCircle size={28} className="user-icon" />
  )}
</>


    {/* ✅ תפריט */}
    {showUserMenu && (
      <div className={`user-menu ${isMobile && showUserMenu ? "open" : ""}`}>
        <div className="user-menu-header">
          {user?.username ? (
            <>שלום, {user.username}</>
          ) : (
            <button className="user-menu-item" onClick={() => setActiveModal("login")}>
              התחברות
            </button>
          )}
        </div>

        <button className="user-menu-item" onClick={() => setShowMyOrders(true)}>ההזמנות שלי</button>
        <button className="user-menu-item" onClick={() => setShowBudgetChat(true)}>צור תפריט אישי</button>
        <button className="user-menu-item" onClick={() => setShowSavedMenus(true)}>תפריטים ששמרת</button>
        <button className="user-menu-item" onClick={() => setShowSettingsPanel(true)}>הגדרות משתמש</button>

        {user?.points != null && (
          <button className="user-menu-item">
            יש לך: {user.points} נקודות<br />
            {user.points > 0 && (
              <small className="points-note">
                ניתן לממש עד {new Date(expireDate).toLocaleDateString("he-IL")}
              </small>
            )}
          </button>
        )}

        {user?.username && (
          loading ? <LoadingSpinner /> :
          <button className="user-menu-item logout" onClick={handleLogout}>התנתקות</button>
        )}
      </div>
    )}
  </div>
</>

//<LoadingSpinner result="error" />
    );
        };
        export default Menu;
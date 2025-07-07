import React, { useState, useEffect , useRef  } from "react";
import { createPortal } from "react-dom";
import "../../componnents/userMenu/Menu.css";
import LoadingSpinner from "../LoadingSpinner";
import { FaUserCircle } from "react-icons/fa";




  const Menu = ({setShowBudgetChat , setShowSavedMenus , setShowSettingsPanel  ,  setActiveModal  , user , loading , setLoading , setUser , setShowMyOrders}) => {
      const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);  
  const [expireDate, setExpireDate] = useState(null);

      
  

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
        if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
          setShowUserMenu(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);




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

              <button
  className="user-menu-item"
  onClick={() => setShowMyOrders(true)}
>
  ההזמנות שלי
</button>
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
{user?.points != null && (
  <button className="user-menu-item">
    יש לך: {user.points} נקודות<br></br>
        {user.points>0 && ( 
               <small className="points-note">
      ניתן לממש עד {new Date(expireDate)
      .toLocaleDateString("he-IL")}
    </small>
)}


  </button>
)}  

            {user?.username && (loading ?  <LoadingSpinner />: <button className="user-menu-item logout" onClick={handleLogout}>התנתקות</button>)}
            </div>
          )}
        </div>
//<LoadingSpinner result="error" />
    );
        };
        export default Menu;
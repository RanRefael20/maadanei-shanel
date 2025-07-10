import React, { useState, useEffect, useRef } from "react";
import "../../componnents/userMenu/Menu.css";
import LoadingSpinner from "../LoadingSpinner";


const Menu = ({
  setShowBudgetChat,
  setShowSavedMenus,
  setShowSettingsPanel,
  setActiveModal,
  user,
  loading,
  setLoading,
  setUser,
  setShowMyOrders,
  
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const userMenuRef = useRef(null);
  const [expireDate, setExpireDate] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [enableSwipe, setEnableSwipe] = useState(false);

const isAdmin = user?.email === "nashelcheese@gmail.com";

  const startXRef = useRef(0);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    if (user?.lastOrderAt) {
      const date = new Date(user.lastOrderAt);
      date.setMonth(date.getMonth() + 3);
      setExpireDate(date);
    }
  }, [user]);


  



  // גרירת מסך במובייל
  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

    const handleTouchEnd = () => {
    if (dragOffset > 50) {
      handleCloseMenu(); // סגירה עם אנימציה
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    const diff = Math.min(
      Math.max(0, startXRef.current - currentX),
      window.innerWidth * 0.7
    );
    setDragOffset(diff);
  };



useEffect(() => {
  if (!enableSwipe) return;

  window.addEventListener("touchstart", handleTouchStart);
  window.addEventListener("touchend", handleTouchEnd);

  return () => {
  };
}, [enableSwipe ]); // ✅ מופעל רק אם אישרנו swipe


  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = showUserMenu ? "hidden" : "auto";
    }
  }, [showUserMenu, isMobile]);

  // סגירה חלקה
const handleCloseMenu = () => {
  if (showUserMenu) {
    setIsClosing(true); // מוסיף מחלקת closing לסגירה עם אנימציה
    setTimeout(() => {
      setShowUserMenu(false);
      setIsClosing(false);
    }, 1100); // אותו זמן כמו האנימציה ב-CSS
  } else {
    setShowUserMenu(true); // פתיחה מיידית
  }
};



  const handleLogout = () => {
    if (!user?.username) return;
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setUser(null);
      setLoading(false);
    }, 2000);
  };

  return (
    <>
      {showUserMenu && (
        <div
          className="menu-overlay"
          onClick={() => {
             handleCloseMenu();
          }}
        />
      )}

      <div
        className="user-menu-wrapper"
        ref={userMenuRef}
       /*  onMouseEnter={() => {
           setShowUserMenu(true);
        }} */
        onClick={() => {
           setShowUserMenu(true);
        }}
        style={{ display: "flex", justifyContent: "flex-end", cursor: "pointer" }}
      >

            <div
          className="hamburger-icon"
          onClick={() => {

            
             if (showUserMenu) {
    setIsClosing(true); // מוסיף מחלקת closing לסגירה עם אנימציה
    setTimeout(() => {
      setShowUserMenu(false);
      setIsClosing(false);
    }, 1100); // אותו זמן כמו האנימציה ב-CSS
  } else {
  const fakeTouchEvent = {
    touches: [{ clientX: 0 }],
    changedTouches: [{ clientX: 100 }]
  };

  handleTouchStart(fakeTouchEvent);
  setTimeout(() => handleTouchEnd(fakeTouchEvent), 100);  }
  // יצירת אובייקט מדומה כמו touch

}}

/*   onMouseEnter={() => {
      const fakeTouchEvent = {
    touches: [{ clientX: 0 }],
    changedTouches: [{ clientX: 100 }]
  };
  handleTouchStart(fakeTouchEvent);
  setTimeout(() => handleTouchEnd(fakeTouchEvent), 100);
  }} */
        >
          <span className={`bar top-bar ${showUserMenu ? "open" : ""}`} />
          <span className={`bar bottom-bar ${showUserMenu ? "open" : ""}`} />
        </div>




      </div>

      {showUserMenu && (
       <div
  className={`user-menu ${showUserMenu ? "open" : ""} ${isClosing ? "closing" : ""} ${
    isDragging ? "dragging" : ""
  }`}
  style={
    isDragging
      ? {
          transform: `translateX(${
            100 - (dragOffset / (window.innerWidth * 0.7)) * 100
          }%)`,
        }
      : {}
  }
>

     
          <div className="user-menu-header">
            {user?.username ? (
              <>שלום, {user.username}</>
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
  {!user
    ? "ההזמנות שלי"
    : isAdmin
    ? "כל ההזמנות"
    : "ההזמנות שלי"}
</button>

      {isAdmin&&( 
    <button className="user-menu-item" onClick={() => setActiveModal("users")}>
      משתמשים
    </button>
     )} 

          <button className="user-menu-item" onClick={() => setShowBudgetChat(true)}>
            צור תפריט אישי
          </button>
          <button className="user-menu-item" onClick={() => setShowSavedMenus(true)}>
            תפריטים ששמרת
          </button>
          <button className="user-menu-item" onClick={() => setShowSettingsPanel(true)}>
            הגדרות משתמש
          </button>

          {user?.points != null && (
            <button className="user-menu-item">
              יש לך: {user.points} נקודות
              {user.points > 0 && expireDate && <br />}
              {user.points > 0 && (
                <small className="points-note">
                  ניתן לממש עד {new Date(expireDate).toLocaleDateString("he-IL")}
                </small>
              )}
            </button>
          )}

          {user?.username &&
            (loading ? (
              <LoadingSpinner />
            ) : (
              <button className="user-menu-item logout" onClick={handleLogout}>
                התנתקות
              </button>
            ))}
        </div>
      )}
    </>
  );
};

export default Menu;

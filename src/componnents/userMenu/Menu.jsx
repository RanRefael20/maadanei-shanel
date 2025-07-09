import React, { useState, useEffect, useRef } from "react";
import "../../componnents/userMenu/Menu.css";
import LoadingSpinner from "../LoadingSpinner";
import { FaUserCircle } from "react-icons/fa";

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

  const startXRef = useRef(0);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    if (user?.lastOrderAt) {
      const date = new Date(user.lastOrderAt);
      date.setMonth(date.getMonth() + 3);
      setExpireDate(date);
    }
  }, [user]);


  useEffect(() => {
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchMove = (e) => {
    touchEndX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = () => {
    const distance = touchEndX - touchStartX;

    // גרירה שמאלה – פותח
    if (distance < -70 && !showUserMenu) {
      setShowUserMenu(true);
    }

    // גרירה ימינה – סוגר
    if (distance > 70 && showUserMenu) {
      setShowUserMenu(false);
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
    setIsClosing(true);
    setTimeout(() => {
      setShowUserMenu(false);
      setIsClosing(false);
    }, 400); // משך האנימציה = כמו ב־CSS
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
            if (!isMobile) handleCloseMenu();
          }}
        />
      )}

      <div
        className="user-menu-wrapper"
        ref={userMenuRef}
        onMouseEnter={() => {
           setShowUserMenu(true);
        }}
        onClick={() => {
           setShowUserMenu(true);
        }}
        style={{ display: "flex", justifyContent: "flex-end", cursor: "pointer" }}
      >
<FaUserCircle
  size={28}
  className="user-icon"
onClick={() => {
 

  // יצירת אובייקט מדומה כמו touch
  const fakeTouchEvent = {
    touches: [{ clientX: 0 }],
    changedTouches: [{ clientX: 100 }]
  };

  handleTouchStart(fakeTouchEvent);
  setTimeout(() => handleTouchEnd(fakeTouchEvent), 100);
}}

  onMouseEnter={() => {
      const fakeTouchEvent = {
    touches: [{ clientX: 0 }],
    changedTouches: [{ clientX: 100 }]
  };
  handleTouchStart(fakeTouchEvent);
  setTimeout(() => handleTouchEnd(fakeTouchEvent), 100);
  }}
/>

      </div>

      {showUserMenu && (
        <div
          className={`user-menu ${showUserMenu ? "open" : ""} ${
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
          <button className="close-icon" onClick={handleCloseMenu}>
            ✖️
          </button>

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

          <button className="user-menu-item" onClick={() => setShowMyOrders(true)}>
            ההזמנות שלי
          </button>
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

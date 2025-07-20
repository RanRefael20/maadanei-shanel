import React, { useState, useEffect, useRef } from "react";
import "../../componnents/userMenu/Menu.css";
import LoadingSpinner from "../LoadingSpinner";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import RegisterErrorModal from "../../login/Eror/RegisterErrorModal";




const Menu = ({
  setShowLoyaltyModal,
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
    const [showSuccess, setShowSuccess] = useState(false);
      const [successMessage, setSuccessMessage] = useState("");
  
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

/* להודעה של הסבר נקודות */
const today = new Date();
const expirationDate = new Date(today);
expirationDate.setMonth(expirationDate.getMonth() + 3);

const formattedToday = today.toLocaleDateString("he-IL");
const formattedExpiration = expirationDate.toLocaleDateString("he-IL");


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
      setIsClosing(true);
      setTimeout(() => {
        setShowUserMenu(false);
        setIsClosing(false);
      }, 1100);
    } else {
      const fakeTouchEvent = {
        touches: [{ clientX: 0 }],
        changedTouches: [{ clientX: 100 }]
      };
      handleTouchStart(fakeTouchEvent);
      setTimeout(() => handleTouchEnd(fakeTouchEvent), 100);
    }
  }}
>
  {/* ✅ קונטיינר שמחזיק את שני הפסים אחד מעל השני */}
  <div className="bar-container">
    <span className={`bar top-bar ${showUserMenu ? "open" : "close"}`} />
    <span className={`bar bottom-bar ${showUserMenu ? "open" : "close"}`} />
  </div>

  {/* כיתוב "תפריט" מימין לפסים */}
  <div className= {!showUserMenu? "TitleMenu-open" :"TitleMenu"}>תפריט</div>
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
                onClick={() =>{ 
          setIsClosing(true);
      setTimeout(() => {
        setShowLoyaltyModal(false)
        setShowUserMenu(false);
        setIsClosing(false);
        setActiveModal("login")
      }, 1100);
                  }}
              >
                התחברות / הרשמה
              </button>
            )}
          </div>
<button
  className="user-menu-item"
  onClick={() =>{
              setIsClosing(true);
      setTimeout(() => {
        setShowLoyaltyModal(false)
        setShowUserMenu(false);
        setIsClosing(false);
       setShowMyOrders(true)
      }, 1100);
     
     }}
>
  {!user
    ? "ההזמנות שלי"
    : isAdmin
    ? "כל ההזמנות"
    : "ההזמנות שלי"}
</button>

      {isAdmin&&( 
    <button className="user-menu-item" onClick={() => {
                  setIsClosing(true);
      setTimeout(() => {
        setShowLoyaltyModal(false)
        setShowUserMenu(false);
        setIsClosing(false);
        setActiveModal("users")
      }, 1100);
      
      }}>
      משתמשים
    </button>
     )} 

          <button className="user-menu-item" onClick={() => {
               setIsClosing(true);
      setTimeout(() => {
        setShowLoyaltyModal(false)
        setShowUserMenu(false);
        setIsClosing(false);
        setShowBudgetChat(true)
      }, 1100);
            }}>
            צור תפריט אישי
          </button>
          <button className="user-menu-item" onClick={() => {
                       setIsClosing(true);
      setTimeout(() => {
        setShowLoyaltyModal(false)
        setShowUserMenu(false);
        setIsClosing(false);
       setShowSavedMenus(true)
      }, 1100);
            
            }}>
            תפריטים ששמרת
          </button>
          <button className="user-menu-item" onClick={() => {
                              setIsClosing(true);
      setTimeout(() => {
        setShowLoyaltyModal(false)
        setShowUserMenu(false);
        setIsClosing(false);
       setShowSettingsPanel(true)
      }, 1100);
            
            }}>
            הגדרות משתמש
          </button>
          


          {user?.points != null && (
            <button className="user-menu-item"
            
            onClick={() => {
                              setIsClosing(true);
      setTimeout(() => {
        setShowLoyaltyModal(false)
        setShowUserMenu(false);
        setIsClosing(false);
                          setSuccessMessage(`<div style="max-width: 460px; margin: auto; background-color: #f9fbff; border: 1px solid #dbe4f0; border-radius: 16px; padding: 20px 24px; font-family: 'Heebo', sans-serif; color: #1f2e52; box-shadow: 0 4px 12px rgba(0,0,0,0.08); direction: rtl; text-align: right;">
  <h2 style="margin: 0 0 12px; color: #2b7de9; font-size: 20px;">👋 שלום ${user.username}!</h2>

  <p style="font-size: 15px; margin: 0;">
    ברוך הבא למערכת <strong style="color:#0080c9;">הנקודות החכמות</strong> שלנו 💎 – כאן כל הזמנה שווה יותר!
  </p>

  <div style="background-color: #e8f1fd; border-radius: 12px; padding: 12px 16px; margin: 16px 0;">
    <p style="margin: 0; font-size: 14.5px;">
      ✅ <strong>כל הזמנה מזכה אותך ב־30% חזרה</strong> בצורת נקודות לרכישות הבאות.
      <br />
      ⏳ <strong>תוקף הנקודות</strong>: 3 חודשים מההזמנה האחרונה – כל הזמנה חדשה מאריכה את התוקף.
    </p>
  </div>

  <div style="background-color: #fff3d4; border-radius: 12px; padding: 12px 16px; border: 1px solid #ffe2a6;">
    <h4 style="margin: 0 0 8px; color: #1f2e52; font-size: 15px;">📌 דוגמה חיה:</h4>
    <ul style="padding-right: 18px; margin: 0; font-size: 14px; line-height: 1.6;">
      <li>הזמנת בתאריך <strong>${formattedToday}</strong> בסך 1,000 ₪</li>
      <li>צברת <strong style="color: #008000;">300 נקודות</strong></li>
      <li>הנקודות בתוקף עד <strong>${formattedExpiration}</strong></li>
      <li>תזמין שוב לפני – והתוקף יתעדכן אוטומטית 🙌</li>
      <li style="color: #d93025;"><strong>לא מזמינים 3 חודשים?</strong> הנקודות יתאפסו</li>
    </ul>
  </div>

  <p style="font-size: 13.5px; margin-top: 14px;">
    📧 חודש לפני פקיעת התוקף – תקבל תזכורת חביבה למייל 💌
  </p>
</div>

`);
      setShowSuccess(true);
      }, 1100);
            
            }}>
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
<div className="menu-credit">
  בניית אתרים <span className="credit-name">רן ביטון</span> |{" "}
  <a
    href="https://wa.me/972559409120"
    target="_blank"
    rel="noopener noreferrer"
    className="credit-whatsapp"
  >
    <span className="whatsapp-icon"><FaWhatsapp size={20} /> </span> 055-940-9120 – וואטסאפ בלבד
  </a>
</div>

        </div>
      )}
      {showSuccess && (
  <RegisterErrorModal
    onClose={() => setShowSuccess(false)}
    errorMessage={successMessage}

setShowSuccess={setShowSuccess}
    source="Menu"
    setActiveModal={setActiveModal}

  />
)}
    </>
    
  );
};

export default Menu;

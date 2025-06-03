
import React, { useEffect, useRef, useState } from "react";import "../styles/NavBar.css";
import "../styles/hiddenLogo.css";
import logo from "../logo/LL.png";
import ContactModal from "./ContactModal"
import AuthManager from "../login/AuthManager";
import { Link } from "react-router-dom";
import useScroll from "../hooks/useScroll";
import SettingsPanel from "../Settings/SettingsPanel"; // ודא שהנתיב נכון
import { FaUserCircle } from "react-icons/fa"; // איקון משתמש
import NavBarCenter from "./NavBarCenter"
import LoadingSpinner from "./LoadingSpinner";




const NavBar = () => {
  /* פתיחת תפריט איש */
const [showUserMenu, setShowUserMenu] = useState(false);  
  const [username, setUsername] = useState(null);
  const [showModal, setShowModal] = useState(false); // לשליטה במודל
   const userMenuRef = useRef(null); // 🔁 עוקב אחרי התפריט
   const [isLoading, setIsLoading] = useState(false);


  const scrolling = useScroll();
  
    /* בדיקה אם המשתמש כבר היה מחובר */
useEffect(() => {
  const checkToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.warn("❌ טוקן שגוי או פג תוקף – התנתקות אוטומטית");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUsername(null);
        return;
      }

      const data = await res.json();
      setUsername(data.username); // ⬅️ זה המידע מהשרת
    } catch (err) {
      console.error("❌ שגיאה באימות טוקן:", err);
    }
  };

  checkToken();
}, []);


  
const handleLogout = () => {
  const currentUser = localStorage.getItem("username");

  if (!currentUser) {
    console.log("אין משתמש מחובר כרגע.");
    return;
  }

  setIsLoading(true); // מציג ספינר

  setTimeout(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null); // מחיקת שם המשתמש מהסטייט
    setIsLoading(false); // מחזיר את כפתור ההתנתקות
  }, 1500); // זמן הספינר
};




    // ✅ סגירה בלחיצה מחוץ לתפריט
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
        document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  return (
    
    <header className={`navbar ${scrolling ? " shrink" : ""}`}>
      <div className={`navbar-logo ${scrolling ? " hidden" : ""}`}>
      <Link to="/">
      <img src={logo} alt="Dairy Delights Logo"  className={`logo ${scrolling ? "revome-title" : ""}`} />
    </Link>
      </div>
     
<NavBarCenter openContactModal={() => setShowModal(true)} />

                   
      
        {/* הצגת שם משתמש */}
        {username  && ( 
          <div className="welcome-message" >
            שלום, {username} 👋
             
          </div>
        ) }
        
         {/* כפתור התחברות  */}
 <AuthManager
  username={username} // ⬅️ חדש
  onLoginSuccess={(name) => setUsername(name)}
/>

    <div className="navbar-right "> 
    <div
      className="user-menu-wrapper"
      ref={userMenuRef}
      onMouseEnter={() => setShowUserMenu(true)}
      onClick={() => setShowUserMenu(true)} // ✅ גם בלחיצה
    >
      <FaUserCircle size={28} className="user-icon" />

      {showUserMenu && (
        <div className="user-menu">
          <div className="user-menu-header">שלום, {username}</div>
          <button className="user-menu-item">ההזמנות שלי</button>
          <div className="user-menu-item">
            <SettingsPanel />
          </div>
          <button className="user-menu-item">הנקודות שלי</button>
{username && (
  isLoading ? (
    <LoadingSpinner text="... טוען" />
  ) : (
    <button className="user-menu-item logout" onClick={handleLogout}>
      התנתקות
    </button>
  )
)}


        </div>
      )}
    </div>
  
   
{/*         <div className={`numPhone ${scrolling ? " hidden" : ""}`}>050-3225482 |</div>
 */}

      </div>
      {/* מפעיל את צור קשר */}
       {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </header>
  );
};

export default NavBar;

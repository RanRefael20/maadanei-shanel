
import React, { useState, useEffect } from "react";
import "../styles/NavBar.css";
import "../styles/hiddenLogo.css";
import logo from "../logo/LL.png";
import NavLink from "./NavLink";
import ContactModal from "./ContactModal"
import AuthManager from "../login/AuthManager";
import { Link } from "react-router-dom";
import useScroll from "../hooks/useScroll";
import SettingsPanel from "../Settings/SettingsPanel"; // ודא שהנתיב נכון
import { FaUserCircle } from "react-icons/fa"; // איקון משתמש
       import BudgetChat from '../componnents/BudgetChat';




const NavBar = () => {
  /* פתיחת תפריט איש */
const [showUserMenu, setShowUserMenu] = useState(false);  
  const [username, setUsername] = useState(null);
  const [showModal, setShowModal] = useState(false); // לשליטה במודל

  const scrolling = useScroll();
    /* בדיקה אם המשתמש כבר היה מחובר */
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
  };

  return (
    
    <header className={`navbar ${scrolling ? " shrink" : ""}`}>
      <div className={`navbar-logo ${scrolling ? " hidden" : ""}`}>
      <Link to="/">
      <img src={logo} alt="Dairy Delights Logo"  className={`logo ${scrolling ? "revome-title" : ""}`} />
    </Link>
      </div>
     
      <div className= {`navbar-center ${scrolling ? " shrink" : ""}`}>
      <Link to="/" style={{ textDecoration: " none" }}>
      <h1 className={`brand-title rubik-gemstones-regular ${scrolling ? "revome-title" : ""}`}>
        מעדני שנאל
      </h1>
    </Link>
                   
 <NavLink openContactModal={() => setShowModal(true)} />  
      </div>
        {/* הצגת שם משתמש */}
        {username  && ( 
          <div className="welcome-message" >
            שלום, {username} 👋
             
          </div>
        ) }
         
  <AuthManager onLoginSuccess={(name) => setUsername(name)} />      
    <div className="navbar-right "> 
   <div  className="user-menu-wrapper"  onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
             <FaUserCircle size={28} className="user-icon" />
            
                  {showUserMenu && (
              <div className="user-menu">
                <div className="user-menu-header">שלום, {username}</div>
                <button className="user-menu-item">ההזמנות שלי</button>
                <div className="user-menu-item"><SettingsPanel /></div>
                <button className="user-menu-item">הנקודות שלי</button>
                <button className="user-menu-item logout" onClick={handleLogout}>התנתקות</button>
              </div>
            )}
          </div>
   
        <div className={`numPhone ${scrolling ? " hidden" : ""}`}>050-3225482 |</div>
      </div>
      {/* מפעיל את צור קשר */}
       {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </header>
  );
};

export default NavBar;

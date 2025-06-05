// ✅ קובץ App.jsx מחובר עם ResultsModal מתוך SavedMenusModal

import React, { useState, useEffect, useRef } from "react";
import NavBarCenter from "./NavBarCenter";
import { Link } from "react-router-dom";
import logo from "../logo/LL.png";
import useScroll from "../hooks/useScroll";
import ContactModal from "./ContactModal";
import AuthManager from "../login/AuthManager";
import SettingsPanel from "../Settings/SettingsPanel";
import LoadingSpinner from "./LoadingSpinner";
import SavedMenusModal from "../SavedMenus/SavedMenus";
import BudgetChat  from "./BudgetChat";
import ResultsModal from "./ResultsModal";
import { FaUserCircle } from "react-icons/fa";
import "../styles/NavBar.css";
import "../styles/hiddenLogo.css";
import DraftSavedModal from "../SavedMenus/success/DraftSavedModal";
import useAuthSync from "../hooks/useAuthSync"; // ✅ ייבוא חסר

const NavBar = () => {
  const { user, loading, setUser } = useAuthSync();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userMenuRef = useRef(null);
  const [showDraftSaved, setShowDraftSaved] = useState(false); // מודל הצלחה לשמירת תפריט 
  const [draftName, setDraftName] = useState("");

  const scrolling = useScroll();

  // טיוטות תפריטים
  const [showSavedMenus, setShowSavedMenus] = useState(false);
  
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [budget, setBudget] = useState(0);
  const [people, setPeople] = useState(0);
  const [dessertCount, setDessertCount] = useState(0);
  const [includeWine, setIncludeWine] = useState(false);

  const handleGenerate = () => {
    // פונקציה לטעינה מחדש של התפריט
  };

  const handleSaveDraft = (name) => {
    setDraftName(name);
    setShowDraftSaved(true);
    setTimeout(() => setShowDraftSaved(false), 3000);
  };

  const handleLogout = () => {
    if (!user?.username) return;
    setIsLoading(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setUser(null);
      setIsLoading(false);
    }, 1500);
  };

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
          <img src={logo} alt="Dairy Delights Logo" className={`logo ${scrolling ? "revome-title" : ""}`} />
        </Link>
      </div>

      <NavBarCenter openContactModal={() => setShowModal(true)} />

      {user?.username && <div className="welcome-message">שלום, {user.username} 👋</div>}

      <AuthManager username={user?.username} onLoginSuccess={(name) => setUser({ username: name })} />

      <div className="navbar-right">
        <div
          className="user-menu-wrapper"
          ref={userMenuRef}
          onMouseEnter={() => setShowUserMenu(true)}
          onClick={() => setShowUserMenu(true)}
        >
          <FaUserCircle size={28} className="user-icon" />

          {showUserMenu && (
            <div className="user-menu">
              <div className="user-menu-header">שלום, {user?.username}</div>
              <button className="user-menu-item">ההזמנות שלי</button>
              <button className="user-menu-item" onClick={() => setShowSavedMenus(true)}>
                תפריטים ששמרת
              </button>
              <div className="user-menu-item">
                <SettingsPanel />
              </div>
              <button className="user-menu-item">הנקודות שלי</button>
              {user?.username && (isLoading ? <LoadingSpinner text="... טוען" /> : <button className="user-menu-item logout" onClick={handleLogout}>התנתקות</button>)}
            </div>
          )}
        </div>
      </div>

      {showModal && <ContactModal onClose={() => setShowModal(false)} />}

      <SavedMenusModal
        isOpen={showSavedMenus}
        onClose={() => setShowSavedMenus(false)}
        onLoadMenu={(loadedMenu) => {
          setResults([{ ...loadedMenu }]);
          setBudget(0);
          setPeople(0);
          setDessertCount(0);
          setIncludeWine(false);
          setShowSavedMenus(false);
          setShowResults(true);
        }}
        userId={user?._id}
      />

<BudgetChat
  draftName={draftName}
        setDraftName={setDraftName}
        onSaveDraft={handleSaveDraft}
        setShowDraftSaved={setShowDraftSaved}
          />


      <ResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        results={results}
        setResults={setResults}
        handleGenerate={handleGenerate}
        budget={budget}
        setBudget={setBudget}
        people={people}
        setPeople={setPeople}
        dessertCount={dessertCount}
        setDessertCount={setDessertCount}
        includeWine={includeWine}
        setIncludeWine={setIncludeWine}
        isLoading={false}
        draftName={draftName}
        setDraftName={setDraftName}
        onSaveDraft={handleSaveDraft}
      />

      {showDraftSaved && <DraftSavedModal onClose={() => setShowDraftSaved(false)} />}
        
    </header>
  );
};

export default NavBar;

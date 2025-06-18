// ✅ קובץ App.jsx מחובר עם ResultsModal מתוך SavedMenusModal

import  { useState, useEffect, useRef } from "react";
import NavBarCenter from "./NavBarCenter";
import { Link } from "react-router-dom";
import logo from "../logo/LL.png";
import useScroll from "../hooks/useScroll";
import ContactModal from "./ContactModal";
import SettingsPanel from "../Settings/SettingsPanel";
import SavedMenus from "../SavedMenus/SavedMenus";
import BudgetChat  from "./BudgetChat";
import ResultsModal from "./ResultsModal";
import "../styles/NavBar.css";
import "../styles/hiddenLogo.css";
import useAuthSync from "../hooks/useAuthSync"; // ✅ ייבוא חסר
import Menu from "./userMenu/Menu";
import AuthManager from "../login/AuthManager";







const NavBar = () => {
  const { user, setUser } = useAuthSync();
  const [showModal, setShowModal] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [showDraftSaved, setShowDraftSaved] = useState(false);//בשביל הטעינה של התפריטים השמורים , רק מפה אפשר להעביר לרזולט
   const [draftId, setDraftId] = useState(null); //ID של כל תפריט


  const scrolling = useScroll();

  // טיוטות תפריטים
  const [showSavedMenus, setShowSavedMenus] = useState(false);

  const [showBudgetChat, setShowBudgetChat] = useState(false); // ✅ תוסיף את זה
  const [activeModal, setActiveModal] = useState(null); // 'login' | 'register' | null
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);//פותח הגדרות משתמש


  
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [budget, setBudget] = useState(0);
  const [people, setPeople] = useState(0);
  const [dessertCount, setDessertCount] = useState(0);
  const [includeWine, setIncludeWine] = useState(false);







  



  return (
    <header className={`navbar ${scrolling ? " shrink" : ""}`}>
      <div className={`navbar-logo ${scrolling ? " hidden" : ""}`}>
        <Link to="/">
          <img src={logo} alt="Dairy Delights Logo" className={`logo ${scrolling ? "revome-title" : ""}`} />
        </Link>
      </div>

      <NavBarCenter openContactModal={() => setShowModal(true)} />


      <div className="navbar-right">


<Menu
setShowBudgetChat={setShowBudgetChat}
setShowSavedMenus={setShowSavedMenus}
setShowSettingsPanel={setShowSettingsPanel}
activeModal={activeModal}
setActiveModal={setActiveModal}
/>



<AuthManager
  username={user?.username}
  activeModal={activeModal}
  setActiveModal={setActiveModal}
  onLoginSuccess={(name) => {
    setUser({ username: name });
    setResults([]);      // ✅ כאן תנקה כאשר מתחלף משתמש הנתונים הקודמים ימחקו
    setDraftName("");    // ✅ גם תנקה
  }}

/>

      </div>



<SettingsPanel
  isOpen={showSettingsPanel}
  onOpen={() => setShowSettingsPanel(true)}
  onClose={() => setShowSettingsPanel(false)}
/>
<BudgetChat
  isOpen={showBudgetChat}
  setIsOpen={setShowBudgetChat}
  draftName={draftName}
  setDraftName={setDraftName}
  />

  



      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
      <SavedMenus
        key={user?._id} // ✅ כך SavedMenus תתאפס ותטען מחדש כשמשתמש משתנה
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
        setDraftId={setDraftId} 
        user={user}
  onSwitchToRegister={() => {
    setShowSavedMenus(false);
    setActiveModal("register"); // ✅ זה מה שפותח את מודאל ההרשמה
  }}
    openBudgetChat={() => setShowBudgetChat(true)} // ✅ זה הפונקציה ש־SavedMenus צריך!

      />

      


    

      <ResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        results={results}
        setResults={setResults}
        budget={budget}
        setBudget={setBudget}
        people={people}
        setPeople={setPeople}
        dessertCount={dessertCount}
        setDessertCount={setDessertCount}
        includeWine={includeWine}
        setIncludeWine={setIncludeWine}
        loading={false}
         showDraftSaved={showDraftSaved}
  setShowDraftSaved={setShowDraftSaved}
  draftId={draftId}                 // ✅ זה הקו החשוב!
  setDraftId={setDraftId}

        />


     
    </header>
  );
};

export default NavBar;

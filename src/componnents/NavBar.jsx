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
import MyOrdersModal from "../componnents/MyOrdersModal";









const NavBar = () => {
  const { user, setUser , loading , setLoading } = useAuthSync();
  const [showModal, setShowModal] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [showDraftSaved, setShowDraftSaved] = useState(false);//בשביל הטעינה של התפריטים השמורים , רק מפה אפשר להעביר לרזולט


  const scrolling = useScroll();

  // טיוטות תפריטים
  const [showSavedMenus, setShowSavedMenus] = useState(false);

  const [showBudgetChat, setShowBudgetChat] = useState(false); // ✅ תוסיף את זה
  const [activeModal, setActiveModal] = useState(null); // 'login' | 'register' | null
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);//פותח הגדרות משתמש
const [showMyOrders, setShowMyOrders] = useState(false);// ההזמנות שלי


  
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [budget, setBudget] = useState(0);
  const [people, setPeople] = useState(0);
  const [dessertCount, setDessertCount] = useState(0);
  const [includeWine, setIncludeWine] = useState(false);



  /* פותח לי הרשמה דרך התפריטים שרשמת במצב לא מחובר  */
const switchToRegisterViaModal = () => {
  setActiveModal(null);
  console.log("נפתחחחחחח");
  
  setTimeout(() => setActiveModal("register"), 100);
};




  



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
setShowMyOrders={setShowMyOrders} // ✅ תעביר את זה!
user={user}
loading ={loading}
setLoading={setLoading}
setUser={setUser}
/>

{showMyOrders && <MyOrdersModal onClose={() => setShowMyOrders(false)}
openBudgetChat ={() => setShowBudgetChat(true)}
setActiveModal={setActiveModal}
/>}


<AuthManager
  setShowMyOrders={setShowMyOrders}
  activeModal={activeModal}
  setActiveModal={setActiveModal}
onLoginSuccess={() => {
  setResults([]);
  setDraftName("");
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
          setResults([{
  name: loadedMenu.name || "תפריט אישי",
  items: loadedMenu.items || [],
  total: loadedMenu.total || loadedMenu.items?.reduce((sum, i) => sum + i.price, 0) || 0
}]);

          setBudget(0);
          setPeople(0);
          setDessertCount(0);
          setIncludeWine(false);
          setShowSavedMenus(false);
          setShowResults(true);
        }}
        user={user}
        loading={loading}
        setLoading={setLoading}
    openBudgetChat={() => setShowBudgetChat(true)} // ✅ זה הפונקציה ש־SavedMenus צריך!
  SwitchToRegister={switchToRegisterViaModal} // ✅ זה מה שהיה חסר!

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
  
        />




     
    </header>
  );
};

export default NavBar;

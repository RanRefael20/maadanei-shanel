// ✅ קובץ App.jsx מחובר עם ResultsModal מתוך SavedMenusModal

import  { useState, useEffect, useRef } from "react";
import NavBarCenter from "./NavBarCenter";
import { fullMenu } from "../data/fullMenu";
import { Link } from "react-router-dom";
import logo from "../logo/LL.png";
import useScroll from "../hooks/useScroll";
import ContactModal from "./contact/ContactModal";
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
import ContactMenu from "./contact/ContactMenu";



const NavBar = () => {
  const { user, setUser , loading , setLoading } = useAuthSync();
  const scrolling = useScroll();
  // טיוטות תפריטים
const [showBudgetChat, setShowBudgetChat] = useState(() => {
  const saved = localStorage.getItem("budgetChatOpen");
  return saved === "true"; // אם כן – תפתח אוטומטית
});

const [showContact, setShowContact] = useState (false);
const [showSavedMenus, setShowSavedMenus] = useState(() => localStorage.getItem("showSavedMenus") === "true");
const [showMyOrders, setShowMyOrders] = useState(() => localStorage.getItem("showMyOrders") === "true");
const [showSettingsPanel, setShowSettingsPanel] = useState(() => localStorage.getItem("showSettingsPanel") === "true");
const [activeModal, setActiveModal] = useState(() => localStorage.getItem("activeModal") || null);
const [showDraftSaved, setShowDraftSaved] = useState(false);
const [draftName, setDraftName] = useState("");
const [dessertCount, setDessertCount] = useState(0);
const [includeWine, setIncludeWine] = useState(false);
const [showResults, setShowResults] = useState(false); 
const [showModal, setShowModal] = useState(false); 
const [itemQuantities, setItemQuantities] = useState({});


const [results, setResults] = useState(() => {
  const saved = localStorage.getItem("results");
  return saved ? JSON.parse(saved) : [];
});

const [people, setPeople] = useState(()=> {
  return localStorage.getItem("people") || "";
})
const [budget, setBudget] = useState(() => {
  return localStorage.getItem("budget") || "0";

})



  /* פותח לי הרשמה דרך התפריטים שרשמת במצב לא מחובר  */
const switchToRegisterViaModal = () => {
  setActiveModal(null);
  console.log("נפתחחחחחח");
  
  setTimeout(() => setActiveModal("register"), 100);
};






useEffect(() => {
  localStorage.setItem("results", JSON.stringify(results)); // results הוא מערך
}, [results]);

useEffect(() => {
  localStorage.setItem("budget", budget); // budget הוא מחרוזת או מספר, לא צריך JSON
}, [budget]);

useEffect(() => {
  localStorage.setItem("people", people); // budget הוא מחרוזת או מספר, לא צריך JSON
}, [people]);

  
useEffect(() => {
  
//localStorage.clear();
  localStorage.setItem("budgetChatOpen", showBudgetChat ? "true" : "false");
}, [showBudgetChat]);



useEffect(() => {
  localStorage.setItem("showSavedMenus", showSavedMenus ? "true" : "false");
}, [showSavedMenus]);

useEffect(() => {
  localStorage.setItem("showMyOrders", showMyOrders ? "true" : "false");
}, [showMyOrders]);

useEffect(() => {
  localStorage.setItem("showSettingsPanel", showSettingsPanel ? "true" : "false");
}, [showSettingsPanel]);

useEffect(() => {
  localStorage.setItem("activeModal", activeModal || "");
}, [activeModal]);



  return (
    <header className=/* {`navbar ${scrolling ? " shrink" : ""}`} */ 'navbar'>
    
<div className="navbar-section navbar-right">

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
 </div>

{/*       <NavBarCenter openContactModal={() => setShowModal(true)} />
 */} 
 
  {/* מרכז עם לוגו ושמאל הלוגו */}
  <div className="navbar-center-wrapper">
    {/* שמאל של הלוגו */}
    <div className="navbar-section navbar-left">
   <ContactMenu/>
      <button className="start-text-button" onClick={() => setShowBudgetChat(true)}>
        start
      </button>
    </div>

    {/* הלוגו עצמו */}
    <div className="navbar-section navbar-center">
      <Link to="/">
        <img src={logo} className="logo" />
      </Link>
    </div>
  </div>

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
  results  = {results}
  setResults = {setResults}
  people={people}
  budget={budget}
  setPeople={setPeople}
  setBudget={setBudget}
  itemQuantities={itemQuantities}
setItemQuantities={setItemQuantities}
  />


  


      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
   <SavedMenus
  key={user?._id}
  isOpen={showSavedMenus}
  onClose={() => setShowSavedMenus(false)}
  onLoadMenu={(loadedMenu) => {
    const enrichedItems = (loadedMenu.items || []).map((item) => {
      const fullItem = (fullMenu[item.category] || []).find(i => i.name === item.name);
      return {
        ...item,
        sizes: fullItem?.sizes || {} // שחזור ה־sizes מהתפריט המלא
      };
    });

    const newQuantities = {};
    enrichedItems.forEach((item) => {
      const key = `${item.name} - ${item.label}`;
      newQuantities[key] = (newQuantities[key] || 0) + 1;
    });

    setItemQuantities(newQuantities);
    setResults([{
      name: loadedMenu.name || "תפריט אישי",
      items: enrichedItems,
      total: loadedMenu.total || enrichedItems.reduce((sum, i) => sum + i.price, 0)
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
  openBudgetChat={() => setShowBudgetChat(true)}
  SwitchToRegister={switchToRegisterViaModal}
  itemQuantities={itemQuantities}
  setItemQuantities={setItemQuantities}
/>



      <ResultsModal
      setShowSavedMenus={setShowSavedMenus}
                          itemQuantities={itemQuantities}
setItemQuantities={setItemQuantities}
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

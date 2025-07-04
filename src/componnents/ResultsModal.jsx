import React, { useState, useEffect , useRef  } from "react";
import { createPortal } from "react-dom";
import "../styles/BudgetChat_modal_results.css";
import FullMenuSelector from "./FullMenuSelector";
import SwipeToCloseWrapper from "../hooks/SwipeToCloseWrapper";
import MenuExportWrapper from "../componnents/MenuExport/MenuExportWrapper";
import DraftSavedModal from "../SavedMenus/success/DraftSavedModal";

import { FaWindowClose, FaWindowMinimize } from "react-icons/fa";

const ResultsModal = ({
   isOpen,
  onClose,
  results,
  setResults,
  handleGenerate,
  budget,
  setBudget,
  people,
  setPeople,
  dessertCount,
  setDessertCount,
  includeWine,
  setIncludeWine,
  showDraftSaved,
   setShowDraftSaved, 
    draftId, // ✅ חדש
  setDraftId, // ✅ חדש
}) => {
    if (!isOpen) return null;

  const [showFullMenu, setShowFullMenu] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [hideMessagePermanently, setHideMessagePermanently] = useState(false);
  const [showMenuExport, setShowMenuExport] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0.9); // שקיפות רגע בעת גרירת חלון

  const modalRef = useRef(null);///חדש 

    useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;




useEffect(() => {
  const allItems = results[0]?.items || [];
  const newCounts = allItems.reduce((acc, item) => {
    if (item.category) {
      acc[item.category] = (acc[item.category] || 0) + 1;
    }
    return acc;
  }, {});
  setCategoryCounts(newCounts);
}, [results]);


  const itemQuantities = {};
if (results[0]?.items) {
  results[0].items.forEach((item) => {
    itemQuantities[item.name] = (itemQuantities[item.name] || 0) + 1;
  });
}

  const handleDeleteItem = (menuIndex, itemIndex) => {
    const updatedResults = results.map((menu, i) => {
      if (i !== menuIndex) return menu;
      const updatedItems = menu.items.filter((_, idx) => idx !== itemIndex);
      const updatedTotal = updatedItems.reduce((sum, item) => sum + item.price, 0);
      return {
        ...menu,
        items: updatedItems,
        total: updatedTotal,
      };
    });
    setResults(updatedResults);
  };

  const handleAddItem = (item) => {
    const updatedResults = [...results];
    const currentMenu = updatedResults[0];
    currentMenu.items.unshift(item);
    currentMenu.total += item.price;
    setResults(updatedResults);
  };

  const handleRemoveItem = (itemToRemove) => {
    const updatedResults = [...results];
    const currentMenu = updatedResults[0];
    const indexToRemove = currentMenu.items.findIndex(
    (item) => item.name === itemToRemove.name && item.category === itemToRemove.category
    );
    if (indexToRemove !== -1) {
      currentMenu.items.splice(indexToRemove, 1);
      currentMenu.total -= itemToRemove.price;
      setResults(updatedResults);
    }
  };





  return createPortal(  
    <div className="results-modal-overlay"   style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
>
<SwipeToCloseWrapper onClose={onClose} setOverlayOpacity={setOverlayOpacity}>
      <div className={`modal-header ${isCollapsed ? "collapsed" : ""}`}>
        
      <div className="closeAndMininize" >
               <button className="close-results-button" onClick={onClose} title="סגור"> <FaWindowClose /></button>
        <button
          className="minimize-button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          title="מזער/פתח"
        >
          {isCollapsed ? "⬈" :  <FaWindowMinimize />}
        </button>
        </div>

        
            <div className="input-summary">
              
              <div className="input-row">
                              <div className="explanation">רוצה לשנות תקציב ? 💶 <br></br>כמות אנשים ? <br></br>אולי להוסיף קינוח ?🍰 <br></br>
                     כאן תוכל  לערוך נתונים מחדש ולבסוף ללחוץ על "טען תוצאות מחדש🔁"  <br></br>עד שתקבל את התפריט שבול בשבילך.  </div>
              
               <label>📋 תקציב:
                  <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="input-field" /> ₪
                </label>
                <label>👥 סועדים:
                  <input type="number" value={people} onChange={(e) => setPeople(Number(e.target.value))} className="input-field" />
                </label>
                <label>🍰 קינוחים:
                  <input type="number" value={dessertCount} onChange={(e) => setDessertCount(Number(e.target.value))} className="input-field" />
                </label>
                <label>🍷 יין:
                  <input type="checkbox" checked={includeWine} onChange={(e) => setIncludeWine(e.target.checked)} />
                </label>
{handleGenerate && (
  <button className="menu-action-button" onClick={handleGenerate}>טען תוצאות מחדש🔁</button>
)}                      
  <button
    className="menu-action-button"
    onClick={() => {
      setShowFullMenu(true);
      if (!hideMessagePermanently) setShowMessage(true);
    }}
    title="כאן תוכל לראות את כל המנות במסעדה 🥽.
תוכל להוסיף פריטים לתפריט שלך עם לחיצה על ➕. 
או להוריד עם ➖."

  >
    ➕ הוספת פריטים
  </button>

  <button className="menu-action-button"onClick={() => setShowDraftSaved(true)} title="שמור טיוטא בתפריטים שלך 💾 . 
תמיד תוכל להיכנס אליו ולערוך אותו.">
  💾 שמור טיוטה
</button>
       

              </div>
              
            </div>
              <div className="category-counts-row">
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <div key={cat} className="category-count">
                  <span>{cat}</span>
                  <span className="count-underline"> - {count}</span>
                </div>
              ))}
            </div>
        
        
            <div className="header-summary-row">
              <span className="menu-total-header">סה״כ: {results[0]?.total || 0}₪</span>
            </div>
          
        

        
          {results.map((menu, i) => (
            <div key={i} className="results-menu-card">
              <h3 className="menu-type">{menu.name}</h3>
<div className="menu-list">
  {Object.entries(
    menu.items.reduce((acc, item) => {
      const cat = item.category || "ללא קטגוריה";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {})
  ).map(([category, items]) => (
    <div key={category} className="category-group">
      <h4 className="category-title">📁 {category}</h4>
      <ul>
        {items.map((item, idx) => (
          <li key={idx} className="menu-item">
            <button className="delete-item-button" onClick={() => handleDeleteItem(i, menu.items.indexOf(item))} title="מחק פריט">✖</button>
            <span>{item.name} - {item.price} ₪</span>
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>

            </div>
          ))}
          <div className="fixed-footer">
            <button className="menu-action-button" onClick={() => { setShowMenuExport(true);}}>✅ סיום</button>

          </div>


 

        {showMessage && createPortal(
          <div className="global-fullscreen-popup">
            <div className="popup-box">
              <h3 style={{ fontFamily: '"Rubik", sans-serif', fontWeight: "bold" }}>! מיד ממשיכים בבחירת המוצרים</h3>
              <p>שים לב : יתכן ותחרוג מהתקציב שהזנת</p>
              <div className="popup-buttons">
                <button className="popup-close-button" onClick={() => setShowMessage(false)}>✖ סגור</button>
                <button className="popup-never-button" onClick={() => {
                  setShowMessage(false);
                  setHideMessagePermanently(true);
                }}>🚫 אל תציג לי שוב</button>
              </div>
            </div>
          </div>,
          document.body
        )}
        </div>
              </SwipeToCloseWrapper> {/* ← כאן מסתיים העטיפה */}

      

      {showFullMenu && (
        <FullMenuSelector
          onClose={() => setShowFullMenu(false)}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          itemQuantities={itemQuantities}
        />
      )}

      {showDraftSaved && (
        <DraftSavedModal
          onClose={() => setShowDraftSaved(false)}
          results={results}             
  
        />
      )}   



      {showMenuExport && (
<MenuExportWrapper
selectedItems={results[0]?.items || []}  onClose={onClose}
  onBackToEdit={() => setShowMenuExport(false)}/>
      )}
    </div>,
        
    document.getElementById("modal-root")
     ) ;
};

export default ResultsModal;

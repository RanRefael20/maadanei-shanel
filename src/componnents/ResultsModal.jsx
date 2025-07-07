import React, { useState, useEffect , useRef  } from "react";
import { createPortal } from "react-dom";
import "../styles/BudgetChat_modal_results.css";
import FullMenuSelector from "./FullMenuSelector";
import SwipeToCloseWrapper from "../hooks/SwipeToCloseWrapper";
import MenuExportWrapper from "../componnents/MenuExport/MenuExportWrapper";
import DraftSavedModal from "../SavedMenus/success/DraftSavedModal";

import { FaWindowClose, FaWindowMinimize } from "react-icons/fa";

const ResultsModal = ({
  
handleAddItemWithVolume,
  handleVolumeMode,
  setShowMyOrders,
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
remainingVolume,
setRemainingVolume,
remainingDessertVolume,
setRemainingDessertVolume, 
   
  
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
    // 🟡 שלב 1: עדכון ווליום לפני המחיקה
    const isDessert = itemToRemove.category === "קינוחים";
    const volumeToRestore = itemToRemove.volume;

    // 🟢 שלב 2: מחיקה ועדכון סכום
    currentMenu.items.splice(indexToRemove, 1);
    currentMenu.total -= itemToRemove.price;

    // 🟢 שלב 3: עדכון סטייט
    setResults(updatedResults);

    // 🔁 שלב 4: עדכון יתרת נפח
    if (isDessert) {
      setRemainingDessertVolume((prev) => prev + volumeToRestore);
    } else {
      setRemainingVolume((prev) => prev + volumeToRestore);
    }
  }
};






  return createPortal(  
    <div className="results-modal-overlay"   style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
>
<SwipeToCloseWrapper onClose={onClose} setOverlayOpacity={setOverlayOpacity}>
      <div className={`modal-header ${isCollapsed ? "collapsed" : ""}`}>
        
      <div className="closeAndMininize" >
               <button className="close-results-button" onClick={()=>{setBudget("") 
               setPeople("")
               setIncludeWine("")
               setDessertCount("")
                onClose();
               }
               } title="סגור"> <FaWindowClose /></button>
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
                {people ==="" && handleGenerate &&(
                  
                              <div className="explanation">רוצה לשנות תקציב ? 💶  <br></br>אולי להוסיף קינוח ?🍰 <br></br>
                     כאן תוכל  לערוך נתונים מחדש ולבסוף ללחוץ על "טען תוצאות מחדש🔁"  <br></br>עד שתקבל את התפריט שבול בשבילך. <br></br> או שעל ידי הוספת פריטים➕ תוכל לבנות תפריט בצורה חופשית</div>
                )}
               {people ==="" && handleGenerate &&(
               <label>📋 תקציב:
                  <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="input-field" /> ₪
                </label>
               )}

                {people !=="" && handleVolumeMode &&(
                  <> 
                
 <label>👥 סועדים:
                  <input type="number" value={people} onChange={(e) => setPeople(Number(e.target.value))} className="input-field" />
                </label>
  <button className="menu-action-button" onClick={handleVolumeMode}>טען מחדש🔁</button>
  </>
                )}
               
                {people ==="" && handleGenerate &&(
                  <> 
                <label>🍰 קינוחים:
                  <input type="number" value={dessertCount} onChange={(e) => setDessertCount(Number(e.target.value))} className="input-field" />
                </label>
                <label>🍷 יין:
                  <input type="checkbox" checked={includeWine} onChange={(e) => setIncludeWine(e.target.checked)} />
                </label>
              
  <button className="menu-action-button" onClick={handleGenerate}>טען תוצאות מחדש🔁</button>
   </>
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

{results[0]?.total > 1 &&(
  <button className="menu-action-button"onClick={() => setShowDraftSaved(true)} title="שמור טיוטא בתפריטים שלך 💾 . 
תמיד תוכל להיכנס אליו ולערוך אותו.">
  💾 שמור טיוטה
</button>
)}
       

              </div>
            </div>
            
             {people !=="" && handleVolumeMode &&(
                 <div className="explanation"><h4>📊 הגדרנו עבורך את כמות המנות המומלצת</h4>
<p>
  בהתאם למספר הסועדים שהזנת, חישבנו עבורך את כמות הפריטים המומלצת.<br />
  תוכל בכל שלב לשנות את מספר הסועדים וללחוץ על <strong>טען מחדש 🔁</strong> כדי לעדכן את החישוב.
</p>

<h4>🍽️ עכשיו הזמן לבחור את המנות</h4>
<p>
  לרשותך עומדת:
  <br />
  ✅ <strong>יתרת נקודות כללית:</strong> <span className="highlight">{remainingVolume}</span>
  <br />
  ✅ <strong>יתרת נקודות לקינוחים:</strong> <span className="highlight">{remainingDessertVolume}</span>
  <br /><br />
  אין חובה לנצל את כל הנקודות.
  <br />
  בכל בחירה – יתרת הנקודות תתעדכן.
  כשתגיע ל־0 נקודות, תדע שזוהי הכמות המומלצת לכמות האנשים שהגדרת ותקבל התראה על כך. כמובן, תוכל לבחור פחות או יותר – לפי רצונך 🎯
</p>
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
    ➕ התחל לבחור
  </button>
                        </div>
        ) }
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
      <h4 className="category-title">📁 {category} - ({items.length}) </h4>
      <ul>
        {items.map((item, idx) => (
          <li key={idx} className="menu-item">
            <button className="delete-item-button" onClick={() => handleDeleteItem(i, menu.items.indexOf(item))} title="מחק פריט">🗑️מחק</button>
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
         onAddItem={ handleAddItemWithVolume ? handleAddItemWithVolume : handleAddItem}
          onRemoveItem={handleRemoveItem}
          itemQuantities={itemQuantities}
          remainingVolume={remainingVolume}
setRemainingVolume = {setRemainingVolume}
remainingDessertVolume={remainingDessertVolume}
setRemainingDessertVolume={setRemainingDessertVolume}
results={results}
 setResults={setResults}
people={people}
budget={budget}
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
setShowMyOrders={setShowMyOrders}
selectedItems={results[0]?.items || []}  onClose={onClose}
  onBackToEdit={() => setShowMenuExport(false)}/>
 
      )}
    </div>,
        
    document.getElementById("modal-root")
     ) ;
};

export default ResultsModal;

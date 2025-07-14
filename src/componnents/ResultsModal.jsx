import React, { useState, useEffect , useRef  } from "react";
import { createPortal } from "react-dom";
import "../styles/BudgetChat_modal_results.css";
import FullMenuSelector from "./FullMenuSelector";
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
          setItemQuantities,
          itemQuantities,
          setShowSavedMenus
  
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

  // חישוב כמות לפי קטגוריות
  const newCounts = {};
  const newQuantities = {};

  allItems.forEach((item) => {
    // ספירת קטגוריות
    if (item.category) {
      newCounts[item.category] = (newCounts[item.category] || 0) + 1;
    }

    // ספירת כמויות לפי שם + מידה (אם יש)
    const key = `${item.name}-${item.label || ""}`;
    newQuantities[key] = (newQuantities[key] || 0) + 1;
  });

  setCategoryCounts(newCounts);
  setItemQuantities(newQuantities);
}, [results]);



  const handleAddItem = (item) => {
    const updatedResults = [...results];
    const currentMenu = updatedResults[0];
   currentMenu.items.unshift({
  ...item,
  label: item.label || "",
  sizeKey: item.sizeKey || "",
  category: item.category || "", // חובה!
});

    currentMenu.total += item.price;
    setResults(updatedResults);
      const uniqueKey = `${item.name.trim()}-${item.label || ""}`;
  setItemQuantities((prev) => ({
    ...prev,
    [uniqueKey]: (prev[uniqueKey] || 0) + 1,
  }));
  };

const handleRemoveItem = (itemToRemove) => {
  const updatedResults = [...results];
  const currentMenu = updatedResults[0];

  const indexToRemove = currentMenu.items.findIndex(
    (item) =>
      item.name === itemToRemove.name &&
      item.category === itemToRemove.category &&
      item.sizeKey === itemToRemove.sizeKey
  );

  if (indexToRemove !== -1) {
    const isDessert = itemToRemove.category === "קינוחים";
    const volumeToRestore = Number(itemToRemove.volume) || 0;

    currentMenu.items.splice(indexToRemove, 1);
    currentMenu.total -= itemToRemove.price;
    setResults(updatedResults);

    if (itemToRemove.category !== "יינות") {
      if (isDessert) {
        setRemainingDessertVolume((prev) => Number(prev) + volumeToRestore);
      } else {
        setRemainingVolume((prev) => Number(prev) + volumeToRestore);
      }
    }
    const key = `${itemToRemove.name}-${itemToRemove.label || ""}`;
setItemQuantities((prev) => {
  const updated = { ...prev };
  if (updated[key]) {
    updated[key]--;
    if (updated[key] <= 0) delete updated[key];
  }
  return updated;
});

    
  }
};




const totalItemsCount = results[0]?.items?.length || 0;




  return createPortal(  
    <div className="results-modal-overlay"   style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
>
{/* <SwipeToCloseWrapper onClose={onClose} setOverlayOpacity={setOverlayOpacity}>
 */}      <div className={`modal-header ${isCollapsed ? "collapsed" : ""}`}>
        
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
  בהתאם למספר הסועדים שהזנת, ערכנו עבורך את כמות המנות שאתה צריך, חישבנו עבורך את כמות הפריטים המומלצת, <br /> כדי לעזור לך להכיר את גודל המנות שלנו - שלא תצטרך להזמין על "עיוור". <br></br>
  כך תקבל בדיוק את הכמות שאתה צריך.
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
<button className="delete-item-button" onClick={() => handleRemoveItem(item)}>🗑️מחק</button>
            <span>{item.name} -<strong>{item.label}</strong>  -  {item.price} ₪</span>
            {people !==""  &&(
            <small style={{ marginRight: "25px" }}>{item.volume} נק'</small>
            )}
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>

            </div>
          ))}

          {totalItemsCount>0&&(
<div className="fixed-footer" onClick={()=>
  setShowMenuExport(true)
}>
    <span className="item-count-circle">{totalItemsCount}</span>
    <span style={{ marginInlineStart: "8px" }}>הצגת פריטים</span>
    <div className="footer-left">
    <span className="total-price"> {results[0]?.total || 0} ₪</span>
  </div>
</div>
          )}




 

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
{/*               </.SwipeToCloseWrapper> {/* ← כאן מסתיים העטיפה */}
 
      

      {showFullMenu && (
        <FullMenuSelector
          onClose={() => setShowFullMenu(false)}
         onAddItem={ handleAddItemWithVolume ? handleAddItemWithVolume : handleAddItem}
          onRemoveItem={handleRemoveItem}
          setItemQuantities={setItemQuantities}
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
  setShowSavedMenus={setShowSavedMenus}
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

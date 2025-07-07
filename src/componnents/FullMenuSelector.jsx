import React, { useRef, useState } from "react";
import { fullMenu } from "../data/fullMenu";
import "../styles/FullMenuSelector.css";
import VolumeFriendlyItems from "./VolumeFriendlyItems";


const FullMenuSelector = ({ onClose, onAddItem, onRemoveItem,  itemQuantities = {} , 
remainingVolume,
remainingDessertVolume,
budget,
results,
people,
setResults,
setRemainingDessertVolume,
setRemainingVolume

 }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
const [selectedForRemoval, setSelectedForRemoval] = useState(null);
const [showDeletedMsg, setShowDeletedMsg] = useState(false);

  const [isMinimized, setIsMinimized] = useState(false);
  const modalRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, dx: 0, dy: 0 });
const [selectedItem, setSelectedItem] = useState(null);


  // התחלת גרירה
  const handleMouseDown = (e) => {
    pos.current.dx = e.clientX;
    pos.current.dy = e.clientY;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // הזזת החלון
  const handleMouseMove = (e) => {
    const deltaX = e.clientX - pos.current.dx;
    const deltaY = e.clientY - pos.current.dy;
    pos.current.dx = e.clientX;
    pos.current.dy = e.clientY;
    const modal = modalRef.current;
    if (modal) {
      modal.style.top = modal.offsetTop + deltaY + "px";
      modal.style.left = modal.offsetLeft + deltaX + "px";
    }
  };

  // שחרור גרירה
  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

const getSuggestedItems = () => {
  const suggestions = [];
  Object.entries(fullMenu).forEach(([category, items]) => {
    items.forEach((item) => {
      if (item.sizes && typeof item.sizes === "object") {
        Object.entries(item.sizes).forEach(([sizeKey, sizeData]) => {
          const isDessert = category === "קינוחים";
          const remaining = isDessert ? remainingDessertVolume : remainingVolume;
          if (sizeData.volume <= remaining) {
            suggestions.push({
              name: `${item.name} - ${sizeData.label}`,
              price: sizeData.price,
              volume: sizeData.volume,
              category,
            });
          }
        });
      }
    });
  });
  return suggestions;
};

  

  return (
    <div className="fullscreen-overlay">
      <div
        className={`floating-modal ${isMinimized ? "minimized" : ""}`}
        ref={modalRef}
        onMouseDown={handleMouseDown}
      >
        <div className="modal-header-fullmenu">
          <h3>הוספת פריטים להזמנה</h3>
          <div className="modal-controls">
            <button onClick={() => setIsMinimized(!isMinimized)}>➖</button>
            <button onClick={onClose}>✖</button>
          </div>
        </div>

        {!isMinimized && (
          

          
          <div className="modal-content">
{remainingVolume<8 && remainingVolume>1 &&(
    <button onClick={() => setShowSuggestions(!showSuggestions)} className="suggestions-button">
{!showSuggestions ? `📋 איזה עוד דברים אני יכול להוסיף ב - ${remainingVolume} נקודות ?`
:`סגור` }
                
              </button>
              )}

  {showSuggestions && (
    <VolumeFriendlyItems
     suggestions={getSuggestedItems()}
      itemQuantities={itemQuantities}
      remainingVolume={remainingVolume}
      onRemoveItem={onRemoveItem}
      onAddItem={onAddItem}
      setShowSuggestions={setShowSuggestions}
    />
  )}
        

            {Object.entries(fullMenu).map(([category, items]) => (
              <div key={category} className="menu-category">
<h3>
  {budget < 1 && people !=="" && people>1
    ? (category === "קינוחים"
        ? `${category} - יתרת נקודות: ${remainingDessertVolume}`
        : `${category} - יתרת נקודות: ${remainingVolume}`)
    : category}
</h3>

                {items.map((item) => {
                  const itemWithCategory = { ...item, category };
                  return (
                    <div key={item.name} className="item-select">
                      <span>
                        {item.name}
                      </span>
                      <div className="quantity-controls">
                      <button
  onClick={() => {
    setSelectedItem(null)
    const matchingItems = results[0]?.items?.filter(
      (itm) => itm.name.startsWith(item.name)
    );
    if(matchingItems.length<1) setSelectedForRemoval(null)
    if (matchingItems.length > 1) {
      setSelectedForRemoval({ baseName: item.name, options: matchingItems });
    } else if (matchingItems.length === 1) {
      onRemoveItem(matchingItems[0]); // אם יש רק אחד – נמחק ישירות
    }
    
  }}
>
  ➖
</button>

{(() => {
  const totalCount = Object.keys(itemQuantities).reduce((sum, key) => {
    return key.startsWith(item.name) ? sum + itemQuantities[key] : sum;
  }, 0);
  return <span className="item-count">{totalCount}</span>;
})()}               
             <button onClick={() => {setSelectedItem(itemWithCategory)
setSelectedForRemoval(null)
             }}>➕</button>
                        </div>
                    </div>
                  );
                })}

                
                
                      {selectedItem && (
          <div className="size-selection-popup">
    <h4>בחר מידה עבור {selectedItem.name}</h4>
{Object.entries(selectedItem.sizes).map(([sizeKey, sizeData]) => (
  <button
    key={sizeKey}
    onClick={(e) => {
      e.stopPropagation(); // מונע bubbling כפול

      const newItem = {
        name: `${selectedItem.name} - ${sizeData.label}`,
        price: sizeData.price,
        volume: sizeData.volume,
        category: selectedItem.category,
      };

      // ✅ קריאה רק פעם אחת
      onAddItem(newItem);
      setSelectedItem(null);
    }}
  >
    {sizeData.label} - ({sizeData.price} ₪)
    {budget < 1 && people !=="" && people>1 &&(
<small style={{ marginRight: "25px" }}>{sizeData.volume} נק'</small>
    )}
     
  </button>
))}

    <button onClick={() => setSelectedItem(null)}>ביטול</button>
  </div>
)}

              </div>
            ))}
            
          </div>
          
        )}
      </div>
      
{selectedForRemoval && (
  <div className="size-selection-popup">
    {/* הודעת נמחק במרכז */}
    {showDeletedMsg && (
      <div className="deleted-msg show">נמחק</div>
    )}

    {/* שאר הפופאפ – רק אם לא מוצגת הודעת נמחק */}
    {!showDeletedMsg && (
      <>
   

        <h4>מה למחוק? ({selectedForRemoval.options.length} פריטים)</h4>

        {selectedForRemoval.options.map((option, i) => (
          <div key={i} className="delete-option-wrapper">
            <button
  onClick={() => {
  const updatedMenu = { ...results[0] };

  // מציאת האינדקס הראשון שתואם את הפריט
  const indexToRemove = updatedMenu.items.findIndex(
    (item) => item.name === option.name && item.price === option.price
  );

  if (indexToRemove !== -1) {
    updatedMenu.items.splice(indexToRemove, 1); // מחק רק אחד
    updatedMenu.total -= option.price;
    setResults([updatedMenu]);
  }

  // עדכון התצוגה של כפתור המחיקה
  const updatedOptions = selectedForRemoval.options.filter((_, index) => index !== i);
  setSelectedForRemoval({ ...selectedForRemoval, options: updatedOptions });

  // הודעה זמנית
  setShowDeletedMsg(true);
  setTimeout(() => {
    setShowDeletedMsg(false);
  }, 1500);
}}


            >
              {option.name} - ({option.price} ₪)
                  {budget < 1 && people !=="" && people>1&&(
<small style={{ marginRight: "25px" }}>{option.volume} נק'</small>
    )}
            </button>
          </div>
        ))}

        <button onClick={() => setSelectedForRemoval(null)}>ביטול</button>
      </>
    )}
  </div>
)}


    </div>
    

  );
  
};





export default FullMenuSelector;

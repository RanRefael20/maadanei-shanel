import React, { useRef, useState } from "react";
import { fullMenu } from "../data/fullMenu";
import "../styles/FullMenuSelector.css";
import VolumeFriendlyItems from "./VolumeFriendlyItems";


const FullMenuSelector = ({ onClose, onAddItem, onRemoveItem,  itemQuantities = {} , setItemQuantities,
remainingVolume,
remainingDessertVolume,
budget,
results,
people,
setResults,
setRemainingDessertVolume,
setRemainingVolume,


 }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
const [selectedForRemoval, setSelectedForRemoval] = useState(null);
const [showDeletedMsg, setShowDeletedMsg] = useState(false);

  const [isMinimized, setIsMinimized] = useState(false);
  const modalRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, dx: 0, dy: 0 });
const [selectedItem, setSelectedItem] = useState(null);
const [searchTerm, setSearchTerm] = useState("");


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
  <input
    type="text"
    placeholder="חפש פריט..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
    style={{
      marginInlineStart: "10px",
      padding: "6px 8px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
      width:"120px"
    }}
  />
  <div className="modal-controls">
    <button onClick={onClose}>✖</button>
  </div>
</div>


        {!isMinimized && (
          

          
          <div className="modal-content">
{remainingVolume<8 && remainingVolume>1 &&(
<div style={{
  position: "sticky",
  top: "80px",
  zIndex: 100,
  padding: "1rem 0",
  marginBottom: "1rem",
}}>
  <button
    onClick={() => setShowSuggestions(!showSuggestions)}
    className="suggestions-button"
  >
    {!showSuggestions
      ? `📋 איזה עוד דברים אני יכול להוסיף ב - נקודות שנשאר לי ?`
      : `סגור`}
  </button>
</div>

              )}

  {showSuggestions && (
    <VolumeFriendlyItems
     suggestions={Object.entries(fullMenu).flatMap(([category, items]) =>
  items.map((item) => ({ ...item, category }))
)}
setItemQuantities={setItemQuantities}
      itemQuantities={itemQuantities}
      remainingVolume={remainingVolume}
      remainingDessertVolume={remainingDessertVolume}
      onRemoveItem={onRemoveItem}
      onAddItem={onAddItem}
      setShowSuggestions={setShowSuggestions}
    />
  )}
        

            {Object.entries(fullMenu).map(([category, items]) => (
              <div key={category} className="menu-category">
<h3>
  {budget < 1 && people !== "" && people > 1 && category !== "יינות"
    ? (category === "קינוחים"
        ? `${category} - יתרת נקודות: ${remainingDessertVolume}`
        : `${category} - יתרת נקודות: ${remainingVolume}`)
    : category}
</h3>


                {items
  .filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((item) => {
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
<span className="item-count">
  {Object.entries(itemQuantities).filter(([key]) =>
    key.startsWith(item.name)
  ).reduce((acc, [, count]) => acc + count, 0)}
</span>

             
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
{selectedItem?.sizes ? (
  Object.entries(selectedItem.sizes).map(([sizeKey, sizeData]) => (
    <button
      key={sizeKey}
onClick={(e) => {
  e.stopPropagation();
  const newItem = {
    name: selectedItem.name,
    category: selectedItem.category,
    sizes: selectedItem.sizes, // שומר את כל המבנה
    sizeKey,
    label: sizeData.label,
    price: sizeData.price,
    volume: sizeData.volume,
  };
  onAddItem(newItem);
}}

    >
    <span>
  {sizeData.label} - ({sizeData.price}₪){" "}
  <small style={{ fontSize: "12px", color: "#666", marginRight: "8px" }}>
     {sizeData.volume} נק'
  </small>
</span>
    </button>
  ))
) : (
  <button
    onClick={(e) => {
      e.stopPropagation();
      const newItem = {
        name: selectedItem.name,
        price: selectedItem.price,
        category: selectedItem.category,
        volume: 0, // ✅ לא משפיע על ווליום
      };
      onAddItem(newItem);
      setSelectedItem(null);
    }}
  >
    {selectedItem.name} - {selectedItem.price}₪
  </button>
)}


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
const removedItem = updatedMenu.items[indexToRemove];

  if (indexToRemove !== -1) {
    
    
    if(option.category ==="קינוחים"){
setRemainingDessertVolume((prev) => Number(prev) + Number(removedItem.volume));
    }else{
    setRemainingVolume((prev) => Number(prev) + Number(removedItem.volume));
    }
    
    
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

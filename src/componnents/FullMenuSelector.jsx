import React, {  useEffect, useRef , useState } from "react";
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
const [floatingLabel, setFloatingLabel] = useState(null); // {text, x, y}
const [showDrops, setShowDrops] = useState(false);
const [activeSize, setActiveSize] = useState(null); // כבר קיים
const [activeSizeKey, setActiveSizeKey] = useState(null); // בשביל להשוות בדיוק שם+מידה
const [maxPrice, setMaxPrice] = useState("");
const [maxVolume, setMaxVolume] = useState("");


    const [showSuggestions, setShowSuggestions] = useState(false);
const [selectedForRemoval, setSelectedForRemoval] = useState(null);
const [showDeletedMsg, setShowDeletedMsg] = useState(false);

  const [isMinimized, setIsMinimized] = useState(false);
  const modalRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, dx: 0, dy: 0 });
const [selectedItem, setSelectedItem] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
const [hasMadeSelection, setHasMadeSelection] = useState(false);
/* const [showDropChildren, setShowDropChildren] = useState(false); // טיפות שמתפצלות
 */
const getRandomConfettiColor = () => {
  const colors = ['#00b853', '#00e0ff', '#ff9800', '#ff2d55', '#ffc107', '#b388ff'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const handleSizeClick = (e, sizeKey, sizeData) => {
    console.log("🟢 handleSizeClick עובד!", sizeKey, sizeData); // ✅ שים את זה בראש הפונקציה

  const buttonRect = e.currentTarget.getBoundingClientRect();
  const centerX = buttonRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top + buttonRect.height / 2;


  const item = {
    name: selectedItem.name,
    category: selectedItem.category,
    sizeKey,
    label: sizeData.label,
    price: sizeData.price,
    volume: sizeData.volume,
    sizes: selectedItem.sizes, // אופציונלי – לשמירה
  };

  const itemKey = `${item.name}-${item.label}`;



  // עדכון אנימציה
  setActiveSize(sizeKey);
  setActiveSizeKey(itemKey);

  // ✅ הוספת פריט (דרך onAddItem שקורא ל־handleAddItemWithVolume)
  onAddItem(item);
  setHasMadeSelection(true);

  // ✅ אנימציית טיפות
  setFloatingLabel({ x: centerX, y: centerY,
    name: item.name,
    label:item.label
   });
  setTimeout(() => setShowDrops(true), 100);
/*   setTimeout(() => setShowDropChildren(true), 200);
 */  setTimeout(() => {
    setFloatingLabel(null);
    setShowDrops(false);
  }, 3000);

  setTimeout(() => setActiveSize(null), 1200);
};

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
    <div className="col">
      <div className="row">
  <h3>הוספת פריטים להזמנה</h3>
      <button className="close-button" onClick={onClose}>✖</button>
      </div>

  <div className="row">
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

    <input
    type="number"
    placeholder="לפי מחיר"
    value={maxPrice}
    onChange={(e) => setMaxPrice(e.target.value)}
    className="search-input"
    style={{ marginInlineStart: "10px", padding: "6px 8px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", width: "120px" }}
  />
{people >0 &&(
  <input
    type="number"
    placeholder="לפי נקודות"
    value={maxVolume}
    onChange={(e) => setMaxVolume(e.target.value)}
    className="search-input"
    style={{ marginInlineStart: "10px", padding: "6px 8px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", width: "120px" }}
  />
  )}
  </div>
  </div>
  <div className="modal-controls">
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

{people>0 &&(
<button
  onClick={() => setShowSuggestions(!showSuggestions)}
  className={showSuggestions ? "suggestions-button-back" : "suggestions-button"}
>
  {!showSuggestions
    ? `📋 איזה עוד דברים אני יכול להוסיף ב - נקודות שנשאר לי ?`
    : `חזור`}
</button>
)}

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
      searchTerm={searchTerm} 
                maxPrice ={maxPrice}
  maxVolume ={maxVolume}
    />
  )}
{!showSuggestions &&
<>
 {Object.entries(fullMenu)
  .map(([category, items]) => {
const isCategoryMatch = category.toLowerCase().includes(searchTerm.toLowerCase());

const matchedItems = items.filter((item) => {
  const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

  if (maxPrice === "" && maxVolume === "") return nameMatch;

  const sizes = item.sizes || {};

  const hasMatchingSize = Object.values(sizes).some((size) => {
    const isPriceOk = maxPrice === "" || size.price <= parseFloat(maxPrice);
    const isVolumeOk = maxVolume === "" || size.volume <= parseFloat(maxVolume);
    return isPriceOk && isVolumeOk;
  });

  return nameMatch && hasMatchingSize;
});
   
    

    if (!isCategoryMatch && matchedItems.length === 0) {
      return null; // לא מציג קטגוריה שלא רלוונטית
    }

    return (
      <div key={category} className="menu-category">
        <h3>
          {budget < 1 && people !== "" && people > 1 && category !== "יינות"
            ? category === "קינוחים"
              ? `${category} - יתרת נקודות: ${remainingDessertVolume}`
              : `${category} - יתרת נקודות: ${remainingVolume}`
            : category}
        </h3>

 {matchedItems.map((item) => {
          const itemWithCategory = { ...item, category };

          return (
            <div key={item.name} className="item-select">
              <span>{item.name}</span>
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




      </div>
    );
  })}

              </>
            }
          </div>
          
        )}
      </div>
                      {selectedItem && (
          <div className="size-selection-popup"
  >
    <h4>בחר מידה עבור {selectedItem.name}</h4>
    

  
{selectedItem?.sizes ? (
  Object.entries(selectedItem.sizes).map(([sizeKey, sizeData]) => {
  const itemKey = `${selectedItem.name}-${sizeData.label}`;
  const quantity = itemQuantities[itemKey] || 0;

    return (
<div className="size-button-wrapper" key={`${selectedItem.name}-${sizeKey}`}>
  
    <button
    className={`size-button ${activeSize === sizeKey ? "animating" : ""} ${
      activeSizeKey === `${selectedItem.name}-${sizeKey}` ? "has-bubble" : ""
    }`}
    onClick={(e) => {e.stopPropagation()
                handleSizeClick(e, sizeKey, sizeData);
                setSelectedItem(false)
              }}
  >
    <span className="original-label">
      {sizeData.label} - ({sizeData.price}₪)
      {people !== "" && (
        <small style={{ fontSize: "12px", color: "#666", marginRight: "8px" }}>
          {sizeData.volume} נק'
        </small>
      )}
    </span>
  </button>

  <div className="inline-counter" onClick={(e) => e.stopPropagation()}>
    {quantity === 0 ? (
 0
    ) : (
      <>
 
        <span className="item-count-inline">{quantity}</span>
      </>
    )}
  </div>
</div>

    );
  })

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
        setHasMadeSelection(true);

    }}
  >
    {selectedItem.name} - {selectedItem.price}₪
  </button>
)}


    <button onClick={() => {setSelectedItem(null)
      setHasMadeSelection(false)
    }}>{hasMadeSelection ? "סגור" : "ביטול"}</button>
  </div>
)}


{showDrops && (
  <div className="drop-wrapper">
    <div className="item-name-bounce">{floatingLabel?.name}
      <br></br>
      <small>{floatingLabel?.label}</small>
    </div>

    {Array.from({ length: 20 }).map((_, i) => {
      const x = Math.random() * 100 - 50 + "px";
      const y = Math.random() * 80 + "px";
      const rotation = Math.random() * 360 + "deg";

      return (
        <div
          key={`confetti-${i}`}
          className="confetti"
          style={{
            left: `calc(${floatingLabel?.x || 0}px + ${x})`,
            top: `calc(${floatingLabel?.y || 0}px + ${y})`,
            transform: `rotate(${rotation})`,
            backgroundColor: getRandomConfettiColor(),
          }}
        />
      );
    })}

    {Array.from({ length: 6 }).map((_, i) => {
      const x = Math.random() * 80 - 40 + "px";
      const y = Math.random() * 40 + "px";
      return (
        <div
          key={`drop-${i}`}
          className="drop"
          style={{
            left: `${floatingLabel?.x + 20}px`,
            top: `${floatingLabel?.y + 10}px`,
            "--x": x,
            "--y": y,
          }}
        />
      );
    })}
  </div>
)}




      
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

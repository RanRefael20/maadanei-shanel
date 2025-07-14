// ✅ VolumeFriendlyItems.
// jsx - קומפוננטת הצעות לפי ווליום שנשאר

import React,{ useState , useMemo  } from "react"; // הוספת useState

import "../styles/VolumeFriendlyItems.css";

const VolumeFriendlyItems = ({
  suggestions = [],
  itemQuantities = {},
  setItemQuantities,
  remainingVolume,
  remainingDessertVolume,
  onAddItem,
  onRemoveItem,
  setShowSuggestions,
    searchTerm = "" ,// ✅ ברירת מחדל ריקה
      maxPrice = "", // ✅ חדש
  maxVolume = "", // ✅ חדש

}) => {

  const mixer = Number(remainingVolume) + Number(remainingDessertVolume);

  const [useMerged, setUseMerged] = useState(false);
const normalizedSearch = searchTerm.trim().toLowerCase();

const filteredSuggestions = useMemo(() => {
  const expanded = [];

  for (const item of suggestions) {
    const matchesSearch =
      item.name.toLowerCase().includes(normalizedSearch) ||
      item.category.toLowerCase().includes(normalizedSearch);

    if (!matchesSearch && normalizedSearch.length > 0) continue;

    if (item.sizes) {
      for (const [sizeKey, sizeDetails] of Object.entries(item.sizes)) {
        const volume = Number(sizeDetails.volume);
        if (isNaN(volume)) continue;

  const allowByVolume = useMerged
  ? volume <= mixer
  : item.category === "קינוחים"
    ? volume <= Number(remainingDessertVolume)
    : volume <= Number(remainingVolume);

const allowByPrice = maxPrice === "" || sizeDetails.price <= parseFloat(maxPrice);
const allowByMaxVolume = maxVolume === "" || volume <= parseFloat(maxVolume);

if (allowByVolume && allowByPrice && allowByMaxVolume) {
  expanded.push({
    ...item,
    sizeKey,
    price: sizeDetails.price,
    volume: sizeDetails.volume,
    label: sizeDetails.label,
    name: item.name.trim(),
  });
}

      }
    } else {
      const volume = Number(item.volume);
      if (isNaN(volume)) continue;

const allowByVolume = useMerged
  ? volume <= mixer
  : item.category === "קינוחים"
    ? volume <= Number(remainingDessertVolume)
    : volume <= Number(remainingVolume);

const allowByPrice = maxPrice === "" || item.price <= parseFloat(maxPrice);
const allowByMaxVolume = maxVolume === "" || volume <= parseFloat(maxVolume);

if (allowByVolume && allowByPrice && allowByMaxVolume) {
  expanded.push(item);
}

    }
  }

  return expanded;
}, [suggestions, useMerged, remainingVolume, remainingDessertVolume, searchTerm]);



  // ✅ מקבץ את הפריטים המסוננים לפי קטגוריה
const groupedByCategory = useMemo(() => {
  
  return filteredSuggestions.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    // מצרפים את שם המידה (M/L) לשם
    const itemWithSize = {
      ...item,
      displayName: `${item.name} - ${item.price}₪   ` , // לדוגמה: "מגש פחזניות - מידה L"
      
    };

    acc[item.category].push(itemWithSize);
    return acc;
  }, {});
}, [filteredSuggestions]);
return (
  <div className="suggested-items-container">
    <div className="sticky-header">
      <h2 className="suggested-items-title">
        {useMerged ? (
          <>
            🔁 כעת מוצגים פריטים עד <span className="color-red">{mixer}</span> נקודות סה"כ (ממוזג)
          </>
        ) : (
          <>
            🔍 ניתן להוסיף פריטים עד <span className="color-red">{remainingVolume}</span> נקודות<br />
            וקינוחים עד <span className="color-red">{remainingDessertVolume}</span> נקודות<br />
            באפשרותך למזג את הנקודות ולקבל את כל הפריטים שהם עד {mixer} נקודות
          </>
        )}
      </h2>

      <button
        className="menu-action-button"
        onClick={() => setUseMerged(!useMerged)}
      >
        {useMerged ? "הצג לפי קטגוריות נפרדות" : `🔁 מזג נקודות (סה"כ ${mixer})`}
      </button>
    </div>

    {filteredSuggestions.length === 0 ? (
      <>
        <p className="no-suggestions">אין כרגע פריטים שתואמים לנפח הזמין.</p>
        <button
          onClick={() => setShowSuggestions(false)}
          className="suggestions-button"
        >
          סגור
        </button>
      </>
    ) : (
      Object.entries(groupedByCategory).map(([category, items]) => (
        <div key={category} >
          <h3 className="color-red">{category}</h3>
          <ul className="suggested-items-list">
            {items.map((item, index) => {
              const uniqueKey = `${item.name.trim()}-${item.label || ""}`;
              return (
                <li key={index} className="suggested-item">
                  <span className="item-name">
                  
                    {item.displayName}  
                   - <strong>{item.label}</strong> -
            
                    <small >
                      {item.volume} נק'
                    </small>
                  </span>
                  <div className="quantity-controls">
                    <button className="remove-button" onClick={() => onRemoveItem(item)}>
                      -
                    </button>
                    <span className="item-count">{itemQuantities[uniqueKey] || 0}</span>
                    <button className="add-button" onClick={() => onAddItem(item)}>
                      +
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))
    )}

    <div
      className="color-red"
      style={{ marginTop: "1rem", fontWeight: "500", textAlign: "center" }}
    >
       עד כאן פריטים שתואמים לנקודות –  
     
          <button
          onClick={() => setShowSuggestions(false)}
        >
          לחץ כאן לחזרה לתפריט המלא
        </button>
    </div>
  </div>
);
}

export default VolumeFriendlyItems;


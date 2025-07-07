// ✅ VolumeFriendlyItems.jsx - קומפוננטת הצעות לפי ווליום שנשאר
import React from "react";
import "../styles/VolumeFriendlyItems.css";

const VolumeFriendlyItems = ({
  suggestions = [],
  itemQuantities = {},
  remainingVolume,
  onAddItem,
  onRemoveItem,
  setShowSuggestions
}) => {
  const groupedByCategory = suggestions.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="suggested-items-container">
      <h2 className="suggested-items-title">
        🔍 ניתן להוסיף עוד פריטים בנפח של <span className="color-red">{remainingVolume}</span> נקודות:

      </h2>

      {suggestions.length === 0 ? (
        <> 
        <p className="no-suggestions">אין כרגע פריטים שתואמים לנפח הזמין.</p>
                    <button onClick={() => setShowSuggestions(false)} className="suggestions-button">
סגור
                
              </button>
              </>
      ) : (
        Object.entries(groupedByCategory).map(([category, items]) => (
          <div key={category}>
            <h3 className="color-red">{category}</h3>
            <ul className="suggested-items-list">
              {items.map((item, index) => {
                const count = itemQuantities[item.name] || 0;
                return (
                  <li key={index} className="suggested-item">
                    <span className="item-name">{item.name}</span>
                    <div className="quantity-controls">
                      <button
                        className="remove-button"
                        onClick={() => onRemoveItem(item)}
                      >
                        -
                      </button>
                      <span className="item-count">{count}</span>
                      <button
                        className="add-button"
                        onClick={() => onAddItem(item)}
                      >
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

      <div className="color-red" style={{ marginTop: "1rem", fontWeight: "500", textAlign: "center" }}>
        🧠 עד כאן פריטים שתואמים לווליום – תוכל להוסיף עוד למטה 👇
      </div>
    </div>
  );
};

export default VolumeFriendlyItems;

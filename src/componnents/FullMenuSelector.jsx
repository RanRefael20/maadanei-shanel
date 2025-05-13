import React, { useEffect, useRef, useState } from "react";
import { fullMenu } from "../data/fullMenu";
import "../styles/FullMenuSelector.css";

const FullMenuSelector = ({ onSubmit, onClose }) => {
  const [selected, setSelected] = useState({});
  const [isMinimized, setIsMinimized] = useState(false);
  const modalRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, dx: 0, dy: 0 });

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

  // טוגל צ'קבוקס
  const toggle = (name) => {
    setSelected((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // מחיקת פריט מהתצוגה
  const removeItem = (name) => {
    setSelected((prev) => {
      const newSel = { ...prev };
      delete newSel[name];
      return newSel;
    });
  };

  // שליחת פריטים מסומנים
  const handleSubmit = () => {
    const chosen = [];
    Object.entries(fullMenu).forEach(([cat, items]) => {
      items.forEach((item) => {
        if (selected[item.name]) {
          chosen.push(item);
        }
      });
    });
    onSubmit(chosen);
  };

  return (
    <div className="fullscreen-overlay">
      <div className={`floating-modal ${isMinimized ? "minimized" : ""}`} ref={modalRef}>
        <div className="modal-header" onMouseDown={handleMouseDown}>
          <h3>בחר מוצרים</h3>
          <div className="modal-controls">
            <button onClick={() => setIsMinimized(!isMinimized)}>➖</button>
            <button onClick={onClose}>✖</button>
          </div>
        </div>

        {!isMinimized && (
          <div className="modal-content">
            {Object.entries(fullMenu).map(([category, items]) => (
              <div key={category} className="menu-category">
                <h4>{category}</h4>
                {items.map((item) => (
                  <label key={item.name} className="item-select">
                    <input
                      type="checkbox"
                      checked={!!selected[item.name]}
                      onChange={() => toggle(item.name)}
                    />
                    <span>{item.name} – {item.price}₪</span>
                    <button className="delete-icon" onClick={() => removeItem(item.name)}>🗑️</button>
                  </label>
                ))}
              </div>
            ))}

            <div className="menu-total">
              סה״כ נבחר:{" "}
              {Object.entries(fullMenu)
                .flatMap(([_, items]) => items)
                .filter((item) => selected[item.name])
                .reduce((sum, item) => sum + item.price, 0)}₪
            </div>

            <button onClick={handleSubmit}>✅ הוסף לתפריט</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullMenuSelector;

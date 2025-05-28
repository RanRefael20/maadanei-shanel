import React, { useRef, useState } from "react";
import { fullMenu } from "../data/fullMenu";
import "../styles/FullMenuSelector.css";

const FullMenuSelector = ({ onClose, onAddItem  , onRemoveItem, itemQuantities }) => {
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
            {Object.entries(fullMenu).map(([category, items]) => (
              <div key={category} className="menu-category">
                <h3>{category}</h3>
                {items.map((item) => (
                  <div key={item.name} className="item-select">
                    <span>
                      {item.name} – {item.price}₪
                    </span>
                   <div className="quantity-controls">
    <button onClick={() => onRemoveItem(item)}>➖</button>
    <span className="item-count">{itemQuantities[item.name] || 0}</span>
    <button onClick={() => onAddItem(item)}>➕</button>
  </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FullMenuSelector;

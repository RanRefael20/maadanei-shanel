import React, { useRef, useState, useEffect } from "react";

import Draggable from "react-draggable";
import "../styles/BudgetChat_modal_results.css";
import ReactDOM from "react-dom";
import { fullMenu } from "../data/fullMenu";
import FullMenuSelector from "./FullMenuSelector";

const  ResultsModal = ({ isOpen, onClose, results, setResults, focusedWindow, setFocusedWindow }) => {

  const nodeRef = useRef(null);
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState({});


  if (!isOpen || results.length === 0) return null;

useEffect(() => {
  const allItems = results[0]?.items || [];

  const newCounts = Object.entries(fullMenu).reduce((acc, [cat, items]) => {
    const count = items.filter((menuItem) =>
      allItems.some((selectedItem) => selectedItem.name === menuItem.name)
    ).length;
    if (count > 0) acc[cat] = count;
    return acc;
  }, {});

  setCategoryCounts(newCounts);
}, [results]);


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
    currentMenu.items.push(item);
    currentMenu.total += item.price;
    setResults(updatedResults);
  };

  return ReactDOM.createPortal(
    <div
  className={`results-modal-overlay ${
    focusedWindow === "results" ? "focused" : "unfocused"
  }`}
  onMouseDown={() => setFocusedWindow("results")}
>

      <Draggable nodeRef={nodeRef}>
        <div ref={nodeRef} className="results-modal draggable-window">
          <div className="modal-header ">
            <button className="close-results-button" onClick={onClose}>✖</button>
            <div className="header-center">
              <span className="modal-title">טיוטת תפריט</span>
              <span className="menu-total-header">
                סה״כ: {results[0]?.total || 0}₪
              </span>
            </div>
          </div>

          <div className="open-fullmenu-button-row">
            <button className="open-fullmenu-button" onClick={() => setShowFullMenu(true)}>
              ➕ פתח תפריט מלא
            </button>
          </div>

<div className="category-counts-row">
  {Object.entries(categoryCounts).map(([cat, count]) => (
    <div key={cat} className="category-count">
      <span>{cat}</span>
      <span className="count-underline"> - {count}</span>
    </div>
  ))}
</div>


          <div className="results-content">
            {results.map((menu, i) => (
              <div key={i} className="results-menu-card">
                <h3 className="menu-type">{menu.name}</h3>
                <ul className="menu-list">
                  {menu.items.map((item, idx) => (
                    <li key={idx} className="menu-item">
                      <span>{item.name}</span>
                      <span> - {item.price} ₪</span>
                      <button
                        className="delete-item-button"
                        onClick={() => handleDeleteItem(i, idx)}
                        title="מחק פריט"
                      >
                        ✖
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Draggable>

      {showFullMenu && (
        <FullMenuSelector
          onClose={() => setShowFullMenu(false)}
          onAddItem={handleAddItem}
            focusedWindow={focusedWindow}
  setFocusedWindow={setFocusedWindow}
        />
      )}
    </div>,
    document.getElementById("modal-root")
  );
};

export default ResultsModal;

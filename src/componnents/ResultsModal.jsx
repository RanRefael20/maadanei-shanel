import React, { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";
import ReactDOM from "react-dom";
import "../styles/BudgetChat_modal_results.css";
import { fullMenu } from "../data/fullMenu";
import FullMenuSelector from "./FullMenuSelector";
import MenuExport from "./MenuExport";

const ResultsModal = ({ isOpen, onClose, results, setResults, handleGenerate, budget,
  people,
  dessertCount,
  includeWine }) => {
  // ⚠️ כל ה-hooks חייבים להופיע לפני כל return
  const nodeRef = useRef(null);
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMessage, setShowMessage] = useState(false);
  const [hideMessagePermanently, setHideMessagePermanently] = useState(false);
  const [showMenuExport, setShowMenuExport] = useState(false); // PDF



  useEffect(() => {
    const allItems = results[0]?.items || [];

    const newCounts = Object.entries(fullMenu).reduce((acc, [cat, items]) => {
      const namesInCategory = items.map((item) => item.name);
      const count = allItems.filter((selectedItem) =>
        namesInCategory.includes(selectedItem.name)
      ).length;
      if (count > 0) acc[cat] = count;
      return acc;
    }, {});

    setCategoryCounts(newCounts);
  }, [results]);
    // רק אחרי כל ה-hooks מותר לבצע תנאי שמחזיר null
  if (!isOpen) return null;


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
    <div className="results-modal-overlay">
      <div
        style={{
          position: "fixed",
          top: position.y + 57,
          left: position.x + 1170,
          zIndex: 100000,
          display: "flex",
          gap: "4px",
        }}
      >
        <button className="close-results-button" onClick={onClose}>
          ✖
        </button>
        <button
          className="minimize-button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          title="מזער/פתח"
        >
          {isCollapsed ? "⬈" : "–"}
        </button>
      </div>

      <Draggable
        nodeRef={nodeRef}
        handle=".modal-header"
        position={position}
        onDrag={(e, data) => setPosition({ x: data.x, y: data.y })}
        enableUserSelectHack={false}
      >
        <div
          ref={nodeRef}
          className={`results-modal draggable-window ${isCollapsed ? "collapsed" : ""}`}
        >
          <div className="modal-header">
            <div className="category-counts-row">
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <div key={cat} className="category-count">
                  <span>{cat}</span>
                  <span className="count-underline"> - {count}</span>
                </div>
              ))}
            </div>
            <div className="header-center">
              <div className="input-summary">
  <div className="input-row">
    <span>📋 תקציב: {budget} ₪</span>
    <span>👥 סועדים: {people}</span>
    <span>🍰 קינוחים: {dessertCount || 0}</span>
    <span>🍷 יין: {includeWine ? "כן" : "לא"}</span>
  </div>
</div>

              <span className="modal-title">טיוטת תפריט</span>
              <span className="menu-total-header">
                סה״כ: {results[0]?.total || 0}₪
              </span>
            </div>
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

<div className="menu-buttons-row">
  <button
    className="menu-action-button"
    onClick={() => {
      setShowFullMenu(true);
      if (!hideMessagePermanently) setShowMessage(true);
    }}
  >
    ➕ הוספת פריטים
  </button>

  <button
    className="menu-action-button"
    onClick={handleGenerate}
  >
    🔁 טען מחדש
  </button>

  <button
    className="menu-action-button"
    onClick={() => setShowMenuExport(true)}
  >
    ✅ סיום 
  </button>
</div>



          {showMessage &&
            ReactDOM.createPortal(
              <div className="global-fullscreen-popup">
                <div className="popup-box">
                  <h3
                    style={{
                      fontFamily: '"Rubik", sans-serif',
                      fontWeight: "bold",
                    }}
                  >
                    ! מיד ממשיכים בבחירת המוצרים
                  </h3>
                  <p>שים לב : יתכן ותחרוג מהתקציב שהזנת</p>
                  <div className="popup-buttons">
                    <button
                      className="popup-close-button"
                      onClick={() => setShowMessage(false)}
                    >
                      ✖ סגור
                    </button>
                    <button
                      className="popup-never-button"
                      onClick={() => {
                        setShowMessage(false);
                        setHideMessagePermanently(true);
                      }}
                    >
                      🚫 אל תציג לי שוב
                    </button>
                  </div>
                </div>
              </div>,
              document.body
            )}
        </div>
      </Draggable>

      {showFullMenu && (
        <FullMenuSelector
          onClose={() => setShowFullMenu(false)}
          onAddItem={handleAddItem}
        />
      )}

{/* PDF */}
      {showMenuExport && (
  <div className="fullscreen-overlay">
    <div className="menu-export-modal">
      <MenuExport

        results={results}
        updateResults={(items) => {
          const updated = [...results];
          updated[0].items = items;
          updated[0].total = items.reduce((sum, item) => sum + item.price, 0);
          setResults(updated);
        }}
      />
      <button className="close-results-button" onClick={() => setShowMenuExport(false)}>
        ✖
      </button>
    </div>
  </div>
)}

    </div>,
    document.getElementById("modal-root")
  );
};

export default ResultsModal;

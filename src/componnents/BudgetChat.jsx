import React, { useState, useEffect } from "react";

import Modal from "react-modal";
import "../styles/BudgetChat.css";
import ResultsModal from "./ResultsModal"; // או הנתיב הנכון אצלך
import FullMenuSelector from "./FullMenuSelector";





Modal.setAppElement("#root");

const CATEGORY_KEYS = [
  "סלטים",
  "בייגל בייגל",
  "פסטות",
  "קישים ומאפים",
  "מגשי אירוח",
  "דגים"
];

const menuItems = {
  "סלטים": [
    { name: "סלט חלומי | 4.5 ליטר", price: 180 },
    { name: "סלט כרוב עם פיצוחים ברוטב חמאת בוטנים | 4.5 ליטר ", price: 180 },
    { name: "סלט מיקס ירוקים עם בטטה ושקדים | 4.5 ליטר ", price: 180 },
    { name: "סלט יווני | 4.5 ליטר", price: 180 },
    { name: "סלט קינואה בליווי ירקות | 4.5 ליטר ", price: 180 },
    { name: "סלט כרוב עם פיצוחים ברוטב מתוק | 4.5 ליטר ", price: 180 },
    { name: "סלט ירקות ישראלי | 4.5 ליטר ", price: 180 },
    { name: "מגש אנטי-פסטי", price: 180 },
    { name: "כוסות אישיות עם מקלות ירקות | 30 יחידות", price: 180 },
    { name: "פלטת ירקות", price: 180 },
  ],
  "בייגל בייגל": [
    { name: " מגש 20 יחידות |בייגל טונה", price: 330 },
    { name: "מגש 20 יחידות |בייגל שמנת סלמון", price: 400 },
    { name: "מגש 20 יחידות |בייגל ביצים", price: 300 },
    { name: " מגש 20 יחידות |בייגל פסטו , גבינת פטה ואנטי-פסטי", price: 300 }
  ],
  "פסטות": [
    { name: "פסטה שמנת פטריות | 4.5 ליטר ", price: 180 },
    { name: "פסטה רוזה | 4.5 ליטר ", price: 180 },
    { name: "פסטה עגבניות | 4.5 ליטר ", price: 180 },
    { name: "פסטה פסטו שמנת | 4.5 ליטר ", price: 180 },
    { name: "מגש לזניה | 4.5 ליטר ", price: 180 },
    { name: "מגש תפוח אדמה מוקרם | 4.5 ליטר ", price: 180 },
  ],
  "קישים ומאפים": [
    { name: "קיש גבינות ובטטה | קוטר 29", price: 180 },
    { name: "קיש גבינות וברוקולי | קוטר 29", price: 180 },
    { name: "קיש גבינות ופטריות  | קוטר 29 ", price: 180 },
    { name: "קיש גבינות וטירס  | קוטר 29 ", price: 180 },
    { name: "קיש גבינות ובצלים  | קוטר 29 ", price: 180 },
    { name: "מגש לחמי הבית בלווי מטבלים  | קוטר 29 ", price: 250 },
    { name: "מגש לחם שום | 20 יחידות ", price: 180 }
  ],
  "קינוחים": [
    { name: "מגש פובלובות | 30 יחידות ", price: 300 },
    { name: "מגש פירות העונה | 7 אנשים", price: 280 },
    { name: "מגש פחזניות | 30 יחידות ", price: 320 },
    { name: "מגש קונוסים במילוי קרם ", price: 300 },
    { name: "מגש טארלטים במילוי טעמים שונים", price: 220 },
    { name: "מגש עוגיות מפנק - תמרים , שקדים ובראוניז ", price: 280 },
    { name: "מגש עוגות - תפוזים , גזר ושוקולד ", price: 200 },
    { name: "עוגות שמרים שוקולד | 2 פסים ", price: 210 },
    { name: "עוגת קדאיף | קוטר 29 ", price: 230 },
    { name: "מגש אצבעות מילפיי | 20 יחידות ", price: 310 }
  ],
  "מגשי אירוח": [
    { name: "מגש גבינות מפנק ", price: 400 },
    { name: "מגש דגים מעושנים", price: 400 },
    { name: "מגש בורקיטס במילוי ממרח פסטו , קוביה בולגרית , וחסה לאליק", price: 400 },
    { name: "מגש טארטלים במילוי שמנת וסלמון", price: 300 },
    { name: "מגש פריקסה מפנק", price: 450 },
    { name: "מגש פיתות סביח אישיות", price: 375 },
    { name: "מגש גבינות מפנק", price: 400 },
    { name: "מגש חצאי טורטיות במילוי סלט טונה / ביצים", price: 330 }
  ],
  "דגים": [
    { name: "פילה סלמון ברוטב מתקתק " , price: 350 },
    { name: "פילה סלמון ברוטב פסטו עם פרורי לחם מעל", price: 350 },
    { name: "פילה מושט ברוטב לימוני", price: 350 },
    { name: "פילה דניס ברוטב לימוני", price: 350 }
  ],
  "יינות": [
    { name: "יין שורש אדום / לבן | יקב צרעה", price: 210 },
    { name:  "יין הרי יהודה אדום / לבן | יקב צרעה", price: 180 },
    { name: "יין עמוקה לבן", price: 100 }
  ]
};

function getBudgetRangeForPeople(people) {
   if (people <= 5) return [500, 3000];
  if (people <= 10) return [600, 3000];
  if (people <= 15) return [1100, 3000];
  if (people <= 20) return [1500, 4000];
  if (people <= 30) return [2200, 5000];
  if (people <= 40) return [3000, 15000];
  if (people <= 50) return [4000, 15000];
  if (people <= 60) return [4500, 15000];
  if (people <= 70) return [5500, 15000];
  if (people <= 80) return [6500, 20000];
  if (people <= 90) return [7500, 20000];
  if (people <= 100) return [8000, 20000];
  if (people <= 110) return [8500, 20000];
  if (people <= 120) return [9500, 20000];
  if (people <= 130) return [10500, 20000];
  if (people <= 140) return [11500, 20000];
  if (people <= 150) return [12500, 30000];
  if (people <= 160) return [13500, 30000];
  return [10000, 30000];  }

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function generateMenus(budget, people, dessertCount, includeWine) {
  const [minBudget, maxBudget] = getBudgetRangeForPeople(people);

  if (budget < minBudget || budget > maxBudget) {
    alert(`מיד ממשיכים ! \n שים לב : התקציב שהוזן לא תואם את כמות הסועדים.\nהמלצה לתקציב: ${minBudget}₪ - ${maxBudget}₪`);
  }

  const allowedUnder = 200;
  const allowedOver = 180;
  const minTotal = budget - allowedUnder;
  const maxTotal = budget + allowedOver;

  const categories = [...CATEGORY_KEYS];
  if (includeWine) categories.push("יינות");

  const baseItems = categories.flatMap(cat => menuItems[cat] || []);
  const dessertItems = menuItems["קינוחים"] || [];

  let bestCombo = [];
  let bestTotal = 0;

  for (let attempt = 0; attempt < 20; attempt++) {
    let total = 0;
    let items = [];
    let dessertAdded = 0;

    const shuffled = shuffle([...baseItems]);
    const shuffledDesserts = shuffle([...dessertItems]);

    // לולאת קינוחים – רק עד הכמות שהוגדרה
    if (!isNaN(dessertCount) && dessertCount > 0) {
      for (let i = 0; i < shuffledDesserts.length && dessertAdded < dessertCount; i++) {
        const dessert = shuffledDesserts[i];
        if (total + dessert.price <= maxTotal) {
          items.push({ ...dessert });
          total += dessert.price;
          dessertAdded++;
        }
      }
    }

    // לולאת פריטים רגילים (ללא קינוחים)
    while (total < maxTotal) {
      let itemAdded = false;

      for (let item of shuffled) {
        if (total >= minTotal) break;

        if (item.category === "קינוחים") continue; // לא מוסיפים עוד קינוחים

        if (total + item.price <= maxTotal) {
          items.push({ ...item });
          total += item.price;
          itemAdded = true;

          if (total >= minTotal) break;
        }
      }

      if (!itemAdded) break;
    }

    if (total >= minTotal && total <= maxTotal) {
      bestCombo = items;
      bestTotal = total;
      break;
    }

    if (total > bestTotal && total <= maxTotal) {
      bestCombo = items;
      bestTotal = total;
    }
  }

  return [{
    name: "מותאם",
    items: bestCombo,
    total: bestTotal
  }];
}







const BudgetChat = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [budget, setBudget] = useState(1000);
  const [people, setPeople] = useState(10);
  const [dessertCount, setDessertCount] = useState("");
  const [includeWine, setIncludeWine] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [results, setResults] = useState([]);
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [focusedWindow, setFocusedWindow] = useState("results");
  const [isLoading, setIsLoading] = useState(false);// טעינה של 'טען מחדש'
  

  useEffect(() => {
    if (showFullMenu || showResultsModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showFullMenu, showResultsModal]);

  const handleGenerate = () => {
    const b = parseInt(budget);
    const p = parseInt(people);
    const d = parseInt(dessertCount);
    if (isNaN(b) || b < 100 || isNaN(p) || p < 1) {
      alert("הכנס תקציב ומספר סועדים תקפים");
      return;
    }

    
    // סגור את התוצאה הקודמת לפני פתיחה מחודשת
   setIsLoading(true);
     setModalOpen(false);//סגירה של באדגאט
    setShowResultsModal(false);
    setResults([]);

    setTimeout(() => {
      const menus = generateMenus(b, p, d, includeWine);
      setResults(menus);
      setShowResultsModal(true);
      setFocusedWindow("results");
       setIsLoading(false);
    }, 500);
  };

  return (
    <>
      <button className="chat-button" onClick={() => setModalOpen(true)}>
        התאמת תפריט
      </button>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="AI Menu Modal"
        ariaHideApp={false}
        style={{
          content: {
            height: window.innerWidth <= 600 ? "50%" : "70%",
            width: "85%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "800px",
            backgroundColor: "#000000e3",
            padding: window.innerWidth <= 600 ? "1rem" : "2rem",
            borderRadius: "16px",
            direction: "rtl",
            overflowY: "auto",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 10000,
          },
        }}
      >
        <div className="budget-input-section">
          <button className="close-button" onClick={() => setModalOpen(false)}>סגור</button>
          <h2 className="budget-title">באפשרותך לבנות תפריט לפי תקציב</h2>

          <input
            type="number"
            className="budget-input"
            placeholder="הכנס תקציב ב-₪"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <input
            type="number"
            className="budget-input"
            placeholder="מספר סועדים"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          />
          <input
            type="number"
            className="budget-input"
            placeholder="כמה קינוחים (או השאר ריק)"
            value={dessertCount}
            onChange={(e) => setDessertCount(e.target.value)}
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeWine}
              onChange={(e) => setIncludeWine(e.target.checked)}
            />
            רוצים יין?
          </label>

          <button className="generate-button" onClick={handleGenerate}>
            צור תפריט
          </button>
        </div>
      </Modal>

      {showResultsModal && (
        <ResultsModal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          results={results}
          setResults={setResults}
          focusedWindow={focusedWindow}
          setFocusedWindow={setFocusedWindow}
          onOpenFullMenu={() => {
            setShowFullMenu(true);
            setFocusedWindow("full");
          }}
          isLoading={isLoading}// טעינה של טען מחדש ברזולט 
          handleGenerate={handleGenerate} // ✅ חשוב
           

          /* אינפוטים של תקציב וכו */
            budget={budget}
            people={people}
            dessertCount={dessertCount}
             includeWine={includeWine}
             setBudget={setBudget}
setPeople={setPeople}
setDessertCount={setDessertCount}
setIncludeWine={setIncludeWine}

        />
      )}

      {showFullMenu && (
        <FullMenuSelector
          onClose={() => setShowFullMenu(false)}
          onAddItem={(item) => {
            setResults(prev => {
              const updated = [...prev];
              updated[0].items.push(item);
              updated[0].total += item.price;
              return updated;
            });
          }}
          focusedWindow={focusedWindow}
          setFocusedWindow={setFocusedWindow}
        />
      )}

      {isLoading && (
  <div className="loading-overlay">
    <div className="spinner"></div>
    <div className="loading-text">טוען תפריט, אנא המתן...</div>
  </div>
)}
    </>
  );
};

export default BudgetChat;

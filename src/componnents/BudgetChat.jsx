import React, { useState } from "react";
import Modal from "react-modal";
import "../styles/BudgetChat.css";
import MenuExport from "./MenuExport"; // אם באותה תיקייה



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
    { name: "סלט חלומי", price: 180 },
    { name: "סלט כרוב עם פיצוחים ברוטב חמאת בוטנים", price: 180 },
    { name: "סלט מיקס ירוקים עם בטטה ושקדים", price: 180 },
    { name: "סלט יווני", price: 180 },
    { name: "סלט קינואה בליווי ירקות", price: 180 },
    { name: "סלט כרוב עם פיצוחים ברוטב מתוק", price: 180 },
    { name: "סלט ירקות ישראלי", price: 180 },
    { name: "מגש אנטי-פסטי", price: 180 },
    { name: "כוסות אישיות עם מקלות ירקות", price: 180 },
    { name: "פלטת ירקות", price: 180 },
  ],
  "בייגל בייגל": [
    { name: " מגש 20 יחידות |בייגל טונה", price: 330 },
    { name: "מגש 20 יחידות |בייגל שמנת סלמון", price: 400 },
    { name: "מגש 20 יחידות |בייגל ביצים", price: 300 },
    { name: " מגש 20 יחידות |בייגל פסטו , גבינת פטה ואנטי-פסטי", price: 300 }
  ],
  "פסטות": [
    { name: "פסטה שמנת פטריות", price: 180 },
    { name: "פסטה רוזה", price: 180 },
    { name: "פסטה עגבניות", price: 180 },
    { name: "פסטה פסטו שמנת", price: 180 },
    { name: "מגש לזניה | 4.5 Liter", price: 180 },
    { name: "מגש תפוח אדמה מוקרם", price: 180 },
  ],
  "קישים ומאפים": [
    { name: "קיש גבינות ובטטה", price: 180 },
    { name: "קיש גבינות וברוקולי", price: 180 },
    { name: "קיש גבינות ופטריות", price: 180 },
    { name: "קיש גבינות וטירס", price: 180 },
    { name: "קיש גבינות ובצלים ", price: 180 },
    { name: "מגש לחמי הבית בלווי מטבלים ", price: 250 },
    { name: "מגש לחם שום | 20 יחידות ", price: 180 }
  ],
  "קינוחים": [
    { name: "מגש פובלובות ", price: 300 },
    { name: "מגש פירות העונה ", price: 280 },
    { name: "מגש פחזניות ", price: 320 },
    { name: "מגש קונוסים במילוי קרם ", price: 300 },
    { name: "מגש טארלטים במילוי טעמים שונים", price: 220 },
    { name: "מגש עוגיות מפנק - תמרים , שקדים ובראוניז ", price: 280 },
    { name: "מגש עוגות - תפוזים , גזר ושוקולד ", price: 200 },
    { name: "עוגות שמרים שוקולד | 2 פסים ", price: 210 },
    { name: "עוגת קדאיף ", price: 230 },
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
  if (people <= 15) return [800, 3000];
  if (people <= 20) return [1200, 4000];
  if (people <= 30) return [2000, 5000];
  if (people <= 40) return [2500, 7000];
  if (people <= 50) return [3000, 7000];
  if (people <= 60) return [3500, 7000];
  if (people <= 70) return [4000, 8000];
  if (people <= 80) return [4500, 9000];
  if (people <= 90) return [5000, 9000];
  return [5500, 11000];
}

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
    alert(`שים לב: התקציב אינו בטווח המומלץ לסעודת ${people} איש (בין ${minBudget}₪ ל-${maxBudget}₪). ייתכן שהתפריט לא יהיה מלא.`);
  }

  let total = 0;
  const selectedItems = [];

  const categories = [...CATEGORY_KEYS];
  if (dessertCount > 0) categories.push("קינוחים");
  if (includeWine) categories.push("יינות");

  const allItems = shuffle(categories.flatMap(cat => menuItems[cat] || []));

  for (let item of allItems) {
    if (total + item.price <= budget) {
      selectedItems.push(item);
      total += item.price;
    }
    if (total >= budget) break;
  }

  return [{
    name: "מותאם",
    items: selectedItems,
    total
  }];
}

const BudgetChat = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [budget, setBudget] = useState(0);
  const [people, setPeople] = useState(10);
  const [dessertCount, setDessertCount] = useState(0);
  const [includeWine, setIncludeWine] = useState(false);
  const [results, setResults] = useState([]);

  const handleGenerate = () => {
    const b = parseInt(budget);
    const p = parseInt(people);
    const d = parseInt(dessertCount);

    if (isNaN(b) || isNaN(p) || b < 100 || p < 1) {
      alert("הכנס תקציב ומספר סועדים תקפים");
      return;
    }

    const menus = generateMenus(b, p, d, includeWine);
    setResults(menus);
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
            height:"80%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "800px",
            backgroundColor: "#fff7d4",
            padding: "2rem",
            border: "3px solid #4C3D3D",
            borderRadius: "16px",
            direction: "rtl",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 10000,
          },
        }}
      >
        <div className="budget-input-section">
          <h2 className="budget-title">בנה תפריט לפי תקציב</h2>
          <div className="explanationOrder" >
  לחץ על צור תפריט עד קבלת התפריט הרצוי בטיוטא. <br></br>
  לביצוע ההזמנה , יש להזין בפרטים: שם , מספר נייד, כתובת למשלוח , תאריך ושעה. <br></br>
לחץ על - "צור PDF" , לאחר הורדת הPDF נא לשלוח את הקובץ לווטאסאפ למספר 050-3225482 <br></br> וניצור עמכם קשר לאימות פרטים.
</div>
          <div className="titels">  
 <div >
  הכנס תקציב ב-₪
</div>
<div >
 מספר סועדים
</div>
<div >
   כמה קינוחים (או השאר ריק)
</div>

</div>


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
            כלול יינות?
          </label>


          <button className="generate-button" onClick={handleGenerate}>
            צור תפריט
          </button>
        </div>

        {results.length > 0 ? (
         

          <div className="results">
            <h3 className="tiuta">טיוטא</h3>
            {results.map((menu, i) => (
              
              <div key={i} className="menu-card full-visual scrollable-card">
                <div className="menu-items">
                  {menu.items.map((item, idx) => (
                    <div key={idx} className="menu-item-row">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">{item.price}₪</span>
                    </div>
                  ))}
                </div>
                <div className="menu-total">סה״כ: {menu.total}₪</div>
              </div>
              
            ))}
             <MenuExport results={results} />
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#C07F00" }}>
            לא נמצאו תפריטים מתאימים
          </p>
        )}

        <button className="close-button" onClick={() => setModalOpen(false)}>
          סגור
        </button>
      </Modal>
    </>
  );
};

export default BudgetChat;

import React, { useState, useEffect } from "react";

import Modal from "react-modal";
import "../styles/BudgetChat.css";
import ResultsModal from "./ResultsModal"; // או הנתיב הנכון אצלך
import FullMenuSelector from "./FullMenuSelector";
import LoadingSpinner from "./LoadingSpinner";
import useAuthSync from "../hooks/useAuthSync";
import RegisterErrorModal from "../login/Eror/RegisterErrorModal";








Modal.setAppElement("#root");

const CATEGORY_KEYS = [
  "סלטים",
  "בייגל בייגל",
  "פסטות",
  "קישים ומאפים",
  "מגשי אירוח",
  "דגים"
];

const menuItems= {

  "סלטים": [
    { name: "סלט חלומי", 
        sizes: {
        M: { label: "3 ליטר", price: 110, volume: 3 },
        L: { label: "4.5 ליטר", price: 165, volume: 5 }
      }
     },
    { name: "סלט כרוב עם פיצוחים ברוטב חמאת בוטנים  ",  
     sizes: {
        M: { label: "3 ליטר", price: 110, volume: 3 },
        L: { label: "4.5 ליטר", price: 165, volume: 5 }
      }
    },
    { name: "סלט מיקס ירוקים עם בטטה ושקדים  ", 
    sizes: {
        M: { label: "3 ליטר", price: 110, volume: 3 },
        L: { label: "4.5 ליטר", price: 165, volume: 5 }
      }
    },
    { name: "סלט יווני ",   sizes: {
        M: { label: "3 ליטר", price: 110, volume: 3 },
        L: { label: "4.5 ליטר", price: 165, volume: 5 }
      } },
    { name: "סלט קינואה בליווי ירקות ",   sizes: {
        M: { label: "3 ליטר", price: 110, volume: 3 },
        L: { label: "4.5 ליטר", price: 165, volume: 5 }
      } },
    { name: "סלט כרוב עם פיצוחים ברוטב מתוק  ",   sizes: {
        M: { label: "3 ליטר", price: 110, volume: 3 },
        L: { label: "4.5 ליטר", price: 165, volume: 5 }
      } },
    { name: "סלט ירקות ישראלי",   sizes: {
        M: { label: "3 ליטר", price: 110, volume: 3 },
        L: { label: "4.5 ליטר", price: 165, volume: 5 }
      } },
    { name: "מגש ירקות אנטי-פסטי בתנור",   sizes: {
        M: { label: "M", price: 120, volume: 3 },
        L: { label: "L", price: 185, volume: 5 }
      } },
    { name: "כוסות אישיות עם מקלות ירקות ",   sizes: {
        M: { label: "20 יח'", price: 130, volume: 3 },
        L: { label: "30 יח'", price: 185, volume: 5 }
      } },
    { name: "פלטת ירקות",  sizes: {
        M: { label: "M", price: 130, volume: 3 },
        L: { label: "L", price: 185, volume: 5 }
      } },
  ],
  "בייגל בייגל": [
    { name: "בייגל טונה", sizes: {
        M: { label: "12 יח'", price: 189, volume: 7 },
        L: { label: "20 יח'", price: 315, volume: 12 }
      } },
    { name: "בייגל שמנת סלמון", sizes: {
        M: { label: "12 יח'", price: 230, volume: 7 },
        L: { label: "20 יח'", price: 385, volume: 12 }
      } },
    { name: "בייגל סלט ביצים , בצל ירוק וחסה לאליק", sizes: {
        M: { label: "12 יח'", price: 189, volume: 7 },
        L: { label: "20 יח'", price: 315, volume: 12 }
      } },
    { name: "בייגל פסטו , גבינת פטה ואנטי-פסטי", sizes: {
        M: { label: "12 יח'", price: 189, volume: 7 },
        L: { label: "20 יח'", price: 315, volume: 12 }
      } }
  ],
  "פסטות": [
    { name: "פסטה שמנת פטריות ", sizes: {
        M: { label: "3 ליטר", price: 110, volume: 3 },
        L: { label: "4.5 ליטר", price: 165, volume: 5 }
      } },
    { name: "פסטה רוזה ", sizes: {
        M: { label: "3 ליטר", price: 110, volume: 3 },
        L: { label: "4.5 ליטר", price: 165, volume: 5 }
      } },
    { name: "פסטה עגבניות ", sizes: {
        M: { label: "3 ליטר", price: 110, volume: 3 },
        L: { label: "4.5 ליטר", price: 165, volume: 5 }
      } },
    { name: "פסטה פסטו שמנת ", sizes: {
        M: { label: "3 ליטר", price: 110, volume: 3 },
        L: { label: "4.5 ליטר", price: 165, volume: 5 }
      } },
    { name: "מגש לזניה  ", sizes: {
        M: { label: "3 ליטר", price: 110, volume: 3 },
        L: { label: "4.5 ליטר", price: 165, volume: 5 }
      } },
    { name: "מגש תפוח אדמה מוקרם ", sizes: {
        M: { label: "3 ליטר", price: 110, volume: 3 },
        L: { label: "4.5 ליטר", price: 165, volume: 5 }
      } },
  ],
  "קישים ומאפים": [
    { name: "קיש גבינות ובטטה", sizes: {
        L: { label: "קוטר 29", price: 165, volume: 6 }
      } },
    { name: "קיש גבינות וברוקולי ", sizes: {
        L: { label: "קוטר 29", price: 165, volume: 6 }
      } },
    { name: "קיש גבינות ופטריות   ", sizes: {
        L: { label: "קוטר 29", price: 165, volume: 6 }
      }},
    { name: "קיש גבינות וטירס   ", sizes: {
        L: { label: "קוטר 29", price: 165, volume: 6 }
      } },
    { name: "קיש גבינות ובצלים   ", sizes: {
        L: { label: "קוטר 29", price: 165, volume: 6 }
      } },
    { name: "מגש לחמי הבית בלווי מטבלים  ", sizes: {
        L: { label: "L", price: 235, volume: 7 }
      } },
    { name: "מגש לחם שום | 20 יחידות ", sizes: {
        M: { label: "10 יח'", price: 80, volume: 4 },
        L: { label: "20 יח'", price: 165, volume: 8 }
      } }
  ],
  "קינוחים": [
    { name: "מגש פובלובות | תוספת פרי לבחירה - לציין בהערות", sizes: {
        M: { label: "20 יח'", price: 190, volume: 3 },
        L: { label: "30 יח'", price: 285, volume: 5 }
      } },
    { name: "מגש פירות העונה", sizes: {
        M: { label: "M", price: 180, volume: 3 },
        L: { label: "לארג'", price: 270, volume: 5 }
      } },
    { name: "מגש פחזניות", sizes: {
        M: { label: "20 יח'", price: 305, volume: 3 },
        L: { label: "30 יח'", price: 205, volume: 5 }
      } },
    { name: "מגש קונוסים במילוי קרם ", sizes: {
        M: { label: "20 יח'", price: 190, volume: 3 },
        L: { label: "30 יח'", price: 285, volume: 5 }
      } },
    { name: "מגש טארלטים במילוי קרם פיסטוק , שוקולד לבן , קינדר וכו'", sizes: {
        L: { label: "22 יח'", price: 179, volume: 5 }
      } },
    { name: "מגש מיקס עוגיות - בראוניז , תמרים ושקדים ", sizes: {
        M: { label: "מדיום", price: 180, volume: 3 },
        L: { label: "לארג'", price: 265, volume: 5 }
      } },
    { name: "מיקס עוגות - שוקולד , תפוזים , גזר ", sizes: {
        M: { label: "מדיום", price: 190, volume: 3 },
        L: { label: "לארג'", price: 285, volume: 5 }
      } },
    { name: "פס שוקולד שמרים", sizes: {
        L: { label: "2 יח'", price: 140, volume: 5 }
      } },
    { name: "עוגת קדאיף ", sizes: {
        
        L: { label: "קוטר 29", price: 185, volume: 5 }
      } },
    { name: "צבעות מילפיי ",sizes: {
        M: { label: "10 יח'", price: 150, volume: 3 },
        L: { label: "20 יח'", price: 295, volume: 5 }
      } }
  ],
  "מגשי פרימיום": [
    { name: "מגש גבינות מפנק ", sizes: {
        M: { label: "מדיום", price: 285, volume: 5 },
        L: { label: "לארג'", price: 385, volume: 10 }
      } },
    { name: "מגש דגים מעושנים", sizes: {
        M: { label: "מדיום", price: 285, volume: 5 },
        L: { label: "לארג'", price: 385, volume: 10 }
      } },
    { name: "מגש בורקיטס במילוי ממרח פסטו , קוביה בולגרית , וחסה לאליק", sizes: {
        M: { label: "20 יח'", price: 255, volume: 7 },
        L: { label: "30 יח'", price: 385, volume: 14 }
      } },
    { name: "מגש טארטלים במילוי שמנת וסלמון",sizes: {
        M: { label: "20 יח'", price: 190, volume: 6 },
        L: { label: "30 יח'", price: 285, volume: 12 }
      } },
    { name: "מגש פריקסה מפנק", sizes: {
        M: { label: "20 יח'", price: 320, volume: 8 },
        L: { label: "27 יח'", price: 435, volume: 14 }
      } },
    { name: "מגש פיתות סביח אישיות", sizes: {
        M: { label: "15 יח'", price: 215, volume: 6 },
        L: { label: "25 יח'", price: 360, volume: 12 }
      } },
    { name: "מגש חצאי טורטיות במילוי סלט טונה / ביצים", sizes: {
        L: { label: "20 יח'", price: 315, volume: 10 }
      } }
  ],
  "דגים": [
    { name: "פילה סלמון ברוטב מתקתק " , sizes: {
        L: { label: "שלם", price: 335, volume: 10 }
      } },
    { name: "פילה סלמון ברוטב פסטו עם פרורי לחם מעל", sizes: {
        
        L: { label: "שלם", price: 335, volume: 10 }
      } },
    { name: "פילה מושט ברוטב לימוני", sizes: {
        
        L: { label: "10 יח'", price: 335, volume: 10 }
      } },
    { name: "פילה דניס ברוטב לימוני", sizes: {
        L: { label: "שאל את המוכר לגבי הכמות", price: 430, volume: 10 }
      } }
  ],
  "יינות": [
    { name: "יין שורש אדום / לבן | יקב צרעה", price: 210 },
    { name:  "יין הרי יהודה אדום / לבן | יקב צרעה", price: 180 },
    { name: "יין עמוקה לבן", price: 100 }
  ]
};




function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function generateMenus(budget, dessertCount, includeWine  ) {
const minBudget = budget - 200;
const maxBudget = budget + 180;


    const createItemsWithSizes = (items, category) => {
    return items.flatMap(item => {
      if (!item.sizes) return [];
      return Object.entries(item.sizes).map(([sizeKey, sizeData]) => ({
        name: `${item.name} - ${sizeData.label}`,
        price: sizeData.price,
        volume: sizeData.volume,
        category,
      }));
    });
  };

  const allowedUnder = 200;
  const allowedOver = 180;
  const minTotal = budget - allowedUnder;
  const maxTotal = budget + allowedOver;

  const categories = [...CATEGORY_KEYS];
  if (includeWine) categories.push("יינות");

const baseItems = categories.flatMap(cat =>
  createItemsWithSizes(menuItems[cat] || [], cat)
);
const dessertItems = createItemsWithSizes(menuItems["קינוחים"] || [], "קינוחים");



  let bestCombo = [];
  let bestTotal = 0;

  for (let attempt = 0; attempt < 20; attempt++) {
    let total = 0;
    let items = [];
    let dessertAdded = 0;

    const shuffled = shuffle([...baseItems]);
    const shuffledDesserts = shuffle([...dessertItems]);

    let wineAdded = 0;
const requiredWines = 1; // או 2 או 0 – מה שתרצה כברירת מחדל
const wineItems = shuffle((menuItems["יינות"] || []).map(item => ({ ...item, category: "יינות" })));

// הוספת בקבוקי יין לפני כל דבר אחר
if (includeWine) {
  for (let i = 0; i < wineItems.length && wineAdded < requiredWines; i++) {
    const wine = wineItems[i];
    if (total + wine.price <= maxTotal) {
      items.push({ name: wine.name, price: wine.price, category: wine.category });
      total += wine.price;
      wineAdded++;
    }
  }

  // אם לא הצלחנו להוסיף את כמות היינות הנדרשת – דלג על הניסיון הנוכחי
  if (wineAdded < requiredWines) continue;
}


    // לולאת קינוחים – רק עד הכמות שהוגדרה
    if (!isNaN(dessertCount) && dessertCount > 0) {
      for (let i = 0; i < shuffledDesserts.length && dessertAdded < dessertCount; i++) {
        const dessert = shuffledDesserts[i];
        if (total + dessert.price <= maxTotal) {
items.push({ name: dessert.name, price: dessert.price , category: dessert.category });
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
        items.push({ name: item.name, price: item.price , category: item.category });

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







const BudgetChat = ({  isOpen,  setIsOpen }) => {


  const { user , loading , setLoading } = useAuthSync();//ani po 
    const [showDraftSaved, setShowDraftSaved] = useState(false); // מודל הצלחה לשמירת תפריט 
  const [budget, setBudget] = useState("");
  const [people, setPeople] = useState("");
  const [dessertCount, setDessertCount] = useState("");
  const [includeWine, setIncludeWine] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [results, setResults] = useState([]);
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [focusedWindow, setFocusedWindow] = useState("results");


const [remainingVolume, setRemainingVolume] = useState(0);
const [remainingDessertVolume, setRemainingDessertVolume] = useState(0);

 const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [showPeopleInput, setShowPeopleInput] = useState(false);
    const [hideButtonPeople, setHideButtonPeople] = useState(false);
    const [hideButtonBudget, setHideButtonBudget] = useState(false);
 

    /*אחראי על הודעה חד פעמית לאחר חריגה  */

const [dessertVolumeExceededOnce, setDessertVolumeExceededOnce] = useState(false);
const [mainVolumeExceededOnce, setMainVolumeExceededOnce] = useState(false);




  

  useEffect(() => {
    if (showFullMenu || showResultsModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showFullMenu, showResultsModal]);

  const handleVolumeMode = () => {
    setDessertVolumeExceededOnce(false);
setMainVolumeExceededOnce(false);

    setHideButtonBudget(true)
    setShowPeopleInput(true)
    const p = parseInt(people);
  if (isNaN(p) || p < 4 ) {
      setErrorMessage(" הזינו את מספר הסועדים, לפי המספר שתזינו תקבלו יתרת נקודות. נקודות לקינוחים בנפרד ונקודות לשאר המאכלים בנפרד. לאחר מכן תוכלו להתחיל לבחור על ידי לחיצה על-➕. במהלך הבחירה, תמיד יוצג לכם מספר הנקודות הנותר, כאשר תגיעו ל-0 תדעו שזוהי הכמות המומלצת - אך הבחירה הסופית תמיד בידיים שלכם. פחות, יותר- הכל בהתאם להעדפה אישית. אנחנו כאן כדי ללוות אתכם בבחירה מדוייקת "  )
      setShowError(true)
      return;
    }
    setHideButtonBudget(false)
    setShowPeopleInput(false)

  const mainVolume = (p * 2) + 1;
  const dessertVol = p * 0.5;

 setRemainingVolume(mainVolume);
  setRemainingDessertVolume(dessertVol);
  setResults([
    {
      name: "מותאם לפי אנשים",
      items: [],
      total: 0,
    },
  ]);

  setShowResultsModal(true); // ✅ פותח תוצאה
setIsOpen(false);//סגירה של באדגאט

};



const handleAddItemWithVolume = (item) => {
  
  if( parseInt(budget)>590){    
      const updatedResults = [...results];
  const currentMenu = updatedResults[0];
   currentMenu.items.unshift(item);
    currentMenu.total += item.price;
    setResults(updatedResults);
    return;
  }
  const updatedResults = [...results];
  const currentMenu = updatedResults[0];
  const { volume, category } = item;
  const isDessert = category === "קינוחים";

  if (isDessert) {
    if (remainingDessertVolume < volume) {
      if (!dessertVolumeExceededOnce) {
        setErrorMessage("חרגת מהנפח המותר לקינוחים עבור מספר הסועדים. תוכל עדיין להוסיף, אך זה מעבר להמלצה.");
        setShowError(true);
        setDessertVolumeExceededOnce(true);
      }
    }
    setRemainingDessertVolume(prev => prev - volume);
  } else {
    if (remainingVolume < volume) {
      if (!mainVolumeExceededOnce) {
        setErrorMessage("חרגת מהנפח המומלץ לפריטים לפי מספר הסועדים. תוכל עדיין להוסיף, אך מומלץ להישאר בתחום.");
        setShowError(true);
        setMainVolumeExceededOnce(true);
      }
    }
    setRemainingVolume(prev => prev - volume);
  }
  currentMenu.items.unshift(item);
    currentMenu.total += item.price;
    setResults(updatedResults);

};




  const handleGenerate = () => {
    setDessertVolumeExceededOnce(false);
setMainVolumeExceededOnce(false);

    setShowBudgetInput(true);
    setHideButtonPeople(true)
    
    const b = parseInt(budget);
    
    const d = parseInt(dessertCount);
    if (isNaN(b) || b < 599 ) {
      setErrorMessage(" מינימום תקציב 600₪. התפריט יבנה נטו על פי תקציב, ללא התחשבות בכמות האנשים. באפשרותך לבחור מספר קינוחים שתרצה שיהיו כלולים בתקציב(לא חובה). בנוסף תוכל לבחור אם להכניס יין. 💃 הזמנה נעימה "  )
      setShowError(true)
      return;
    }
setHideButtonPeople(false)
    
    // סגור את התוצאה הקודמת לפני פתיחה מחודשת
   setLoading(true);
     setIsOpen(false);//סגירה של באדגאט
    setShowResultsModal(false);
    setResults([]);

    setTimeout(() => {
      const menus = generateMenus(b,  d, includeWine);
      setResults(menus);
      setShowResultsModal(true);
      setShowBudgetInput(false);
      
      setFocusedWindow("results");
       setLoading(false);
    }, 500);
  };



  return (
    <>
    



      <Modal
       isOpen={isOpen}
  onRequestClose={() => setIsOpen(false)}
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
            zIndex: 200,
          },
        }}
      >
                  <button className="close-button" onClick={() => {setIsOpen(false)
                    setShowBudgetInput(false)
                    setHideButtonPeople(false)
                        setHideButtonBudget(false)
                      setShowPeopleInput(false)
                      setPeople("")
                      setBudget("")
                      setDessertCount("")
                      setIncludeWine("")
                  }}>סגור</button>

        <div className="budget-input-section">
          <h2 className="budget-title">באפשרותך לבנות תפריט לפי תקציב או לפי כמות סועדים</h2>
{showBudgetInput&&(
  <>
  הזן תקציב
     <input
     
            type="number"
            className="budget-input"
            placeholder="הכנס תקציב ב-₪"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
הכנס מספר קינוחים (לא חייב)
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
        </>  
   )}
     
     {showPeopleInput&&(
          <input
            type="number"
            className="budget-input"
            placeholder="מספר סועדים"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          />

     )}
          {!hideButtonBudget &&(
   <button className="generate-button" onClick={handleGenerate}>
            צור תפריט לפי תקציב
          </button>
          )}
       
          {!hideButtonPeople&&(
          <button className="generate-button" onClick={handleVolumeMode}>
           צור תפריט לפי כמות אנשים (יותר מדיוק)
          </button>
          )}

 
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
          loading={loading}// טעינה של טען מחדש ברזולט 
          handleGenerate={handleGenerate} // ✅ חשוב
           handleVolumeMode={handleVolumeMode}

          /* אינפוטים של תקציב וכו */
            budget={budget}
            people={people}
            dessertCount={dessertCount}
             includeWine={includeWine}
             setBudget={setBudget}
setPeople={setPeople}
setDessertCount={setDessertCount}
setIncludeWine={setIncludeWine}
  setShowDraftSaved={setShowDraftSaved}
  showDraftSaved={showDraftSaved}
    handleAddItemWithVolume={handleAddItemWithVolume}
remainingVolume={remainingVolume}
setRemainingVolume={setRemainingVolume}
remainingDessertVolume={remainingDessertVolume}
setRemainingDessertVolume={setRemainingDessertVolume} 

        />
      )}

           {showError && (
        <RegisterErrorModal
          onClose={() => setShowError(false)}
          errorMessage={errorMessage}
          source={"budget"}        
        />
        
      )}

      {showFullMenu && (
<FullMenuSelector
  onClose={() => setShowFullMenu(false)}

/>

      )}

      {loading && (
  <LoadingSpinner text="...טוען" />
)}
    </>
  );
};

export default BudgetChat;

// ✅ קובץ App.jsx מחובר עם ResultsModal מתוך SavedMenusModal

import  { useState, useEffect, useRef } from "react";
import NavBarCenter from "./NavBarCenter";
import { fullMenu } from "../data/fullMenu";
import { Link } from "react-router-dom";
import logo from "../logo/LL.png";
import useScroll from "../hooks/useScroll";
import ContactModal from "./contact/ContactModal";
import SettingsPanel from "../Settings/SettingsPanel";
import SavedMenus from "../SavedMenus/SavedMenus";
import BudgetChat  from "./BudgetChat";
import ResultsModal from "./ResultsModal";
import "../styles/NavBar.css";
import "../styles/hiddenLogo.css";
import useAuthSync from "../hooks/useAuthSync"; // ✅ ייבוא חסר
import Menu from "./userMenu/Menu";
import AuthManager from "../login/AuthManager";
import MyOrdersModal from "../componnents/MyOrdersModal";
import ContactMenu from "./contact/ContactMenu";



const CATEGORY_KEYS = [
  "סלטים",
  "בייגל בייגל",
  "פסטות",
  "קישים ומאפים",
  "מגשי אירוח",
  "דגים"
];

const menuItems= {
    "בייגל בייגל": [
    { name: "בייגל טונה", sizes: {
        M: { label: "12 יח'", price: 189, volume: 6 },
        L: { label: "20 יח'", price: 315, volume: 11 }
      } },
    { name: "בייגל שמנת סלמון", sizes: {
        M: { label: "12 יח'", price: 230, volume: 6 },
        L: { label: "20 יח'", price: 385, volume: 11 }
      } },
    { name: "בייגל סלט ביצים , בצל ירוק וחסה לאליק", sizes: {
        M: { label: "12 יח'", price: 189, volume: 6 },
        L: { label: "20 יח'", price: 315, volume: 11 }
      } },
    { name: "בייגל פסטו , גבינת פטה ואנטי-פסטי", sizes: {
        M: { label: "12 יח'", price: 189, volume: 6 },
        L: { label: "20 יח'", price: 315, volume: 11 }
      } }
  ],
    "מגשי פרימיום": [
    { name: "מגש גבינות מפנק ", sizes: {
        M: { label: "מדיום", price: 285, volume: 6 },
        L: { label: "לארג'", price: 385, volume: 11 }
      } },
    { name: "מגש דגים מעושנים", sizes: {
        M: { label: "מדיום", price: 285, volume: 6 },
        L: { label: "לארג'", price: 385, volume: 11 }
      } },
    { name: "מגש בורקיטס במילוי ממרח פסטו , קוביה בולגרית , וחסה לאליק", sizes: {
        M: { label: "20 יח'", price: 255, volume: 7 },
        L: { label: "30 יח'", price: 385, volume: 13 }
      } },
    { name: "מגש טארטלים במילוי שמנת וסלמון",sizes: {
        M: { label: "20 יח'", price: 190, volume: 6 },
        L: { label: "30 יח'", price: 285, volume: 11 }
      } },
    { name: "מגש פריקסה מפנק", sizes: {
        M: { label: "20 יח'", price: 320, volume: 8 },
        L: { label: "27 יח'", price: 435, volume: 15 }
      } },
    { name: "מגש פיתות סביח אישיות", sizes: {
        M: { label: "15 יח'", price: 215, volume: 7 },
        L: { label: "25 יח'", price: 360, volume: 13 }
      } },
    { name: "מגש חצאי טורטיות במילוי סלט טונה / ביצים", sizes: {
        L: { label: "20 יח'", price: 315, volume: 11 }
      } }
  ],
    "קישים ומאפים": [
    { name: "קיש גבינות ובטטה", sizes: {
        L: { label: "קוטר 29", price: 165, volume: 8 }
      } },
    { name: "קיש גבינות וברוקולי ", sizes: {
        L: { label: "קוטר 29", price: 165, volume: 8 }
      } },
    { name: "קיש גבינות ופטריות   ", sizes: {
        L: { label: "קוטר 29", price: 165, volume: 8 }
      }},
    { name: "קיש גבינות וטירס   ", sizes: {
        L: { label: "קוטר 29", price: 165, volume: 8 }
      } },
    { name: "קיש גבינות ובצלים   ", sizes: {
        L: { label: "קוטר 29", price: 165, volume: 8 }
      } },
    { name: "מגש לחמי הבית בלווי מטבלים  ", sizes: {
        L: { label: "לארג'", price: 235, volume: 8 }
      } },
    { name: "מגש לחם שום", sizes: {
        M: { label: "10 יח'", price: 80, volume: 6 },
        L: { label: "20 יח'", price: 165, volume: 10 }
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
        M: { label: "מדיום", price: 120, volume: 3 },
        L: { label: "לארג'", price: 185, volume: 5 }
      } },
    { name: "כוסות אישיות עם מקלות ירקות ",   sizes: {
        M: { label: "20 יח'", price: 130, volume: 3 },
        L: { label: "30 יח'", price: 185, volume: 5 }
      } },
    { name: "פלטת ירקות",  sizes: {
        M: { label: "מדיום", price: 130, volume: 3 },
        L: { label: "לארג'", price: 185, volume: 5 }
      } },
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
    { name: "יין שורש אדום / לבן | יקב צרעה", price: 210  },
    { name:  "יין הרי יהודה אדום / לבן | יקב צרעה", price: 180 },
    { name: "יין עמוקה לבן", price: 100 }
  ] , 
    "קינוחים": [
    { name: "מגש פובלובות | תוספת פרי לבחירה", sizes: {
        M: { label: "20 יח'", price: 190, volume: 3 },
        L: { label: "30 יח'", price: 285, volume: 5 }
      } },
    { name: "מגש פירות העונה", sizes: {
        M: { label: "מדיום", price: 180, volume: 3 },
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
  ]

};




const NavBar = ({showBudgetChat , setShowBudgetChat ,setShowLoyaltyModal, setActiveModal , activeModal  }) => {
  const { user, setUser , loading , setLoading } = useAuthSync();
  const scrolling = useScroll();
  // טיוטות תפריטים


const [showContact, setShowContact] = useState (false);
 const [showFullMenu, setShowFullMenu] = useState(false);

const [showSavedMenus, setShowSavedMenus] = useState(() => localStorage.getItem("showSavedMenus") === "true");
const [showMyOrders, setShowMyOrders] = useState(() => localStorage.getItem("showMyOrders") === "true");
const [showSettingsPanel, setShowSettingsPanel] = useState(() => localStorage.getItem("showSettingsPanel") === "true");
const [showDraftSaved, setShowDraftSaved] = useState(false);
const [draftName, setDraftName] = useState("");
const [dessertCount, setDessertCount] = useState(0);
const [includeWine, setIncludeWine] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(() => localStorage.getItem("showResultsModal") === "true");
const [showModal, setShowModal] = useState(false); 
const [itemQuantities, setItemQuantities] = useState({});
 const [errorMessage, setErrorMessage] = useState("");
   const [showError, setShowError] = useState(false);
 
setShowError
   setErrorMessage

    /*אחראי על הודעה חד פעמית לאחר חריגה  */
const [dessertVolumeExceededOnce, setDessertVolumeExceededOnce] = useState(false);
const [mainVolumeExceededOnce, setMainVolumeExceededOnce] = useState(false);
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [showPeopleInput, setShowPeopleInput] = useState(false);
     const [hideButtonPeople, setHideButtonPeople] = useState(false);
      const [hideButtonBudget, setHideButtonBudget] = useState(false);
      
   


const [remainingVolume, setRemainingVolume] = useState(()=>{
  return Number(localStorage.getItem("remainingVolume")) || "";
})
const [remainingDessertVolume, setRemainingDessertVolume] = useState(()=>{
  return Number(localStorage.getItem("remainingDessertVolume")) || "";
})




const [results, setResults] = useState(() => {
  const saved = localStorage.getItem("results");
  return saved ? JSON.parse(saved) : [];
});

const [people, setPeople] = useState(()=> {
  return localStorage.getItem("people") || "";
})
const [budget, setBudget] = useState(() => {
  return localStorage.getItem("budget") || "0";

})



  useEffect(() => {
    if (showFullMenu || showResultsModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showFullMenu, showResultsModal]); 
  /* פותח לי הרשמה דרך התפריטים שרשמת במצב לא מחובר  */
const switchToRegisterViaModal = () => {
  setActiveModal(null);
  console.log("נפתחחחחחח");
  
  setTimeout(() => setActiveModal("register"), 100);
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

function generateMenus(budget, dessertCount, includeWine) {
  const minBudget = budget - 200;
  const maxBudget = budget + 180;

  const createItemsWithSizes = (items, category) => {
    return items.flatMap(item => {
      if (!item.sizes) return [];
      return Object.entries(item.sizes).map(([sizeKey, sizeData]) => ({
        name: item.name,
        price: sizeData.price,
        volume: sizeData.volume,
        category,
        label: sizeData.label || "",
        sizeKey
      }));
    });
  };

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
const requiredWines = includeWine
  ? (budget < 3000 ? 1 : 2 + Math.floor((budget - 3000) % 1500))
  : 0;
      const wineItems = shuffle((menuItems["יינות"] || []).map(item => ({
      name: item.name,
      price: item.price,
      category: "יינות",
      label: "",
      sizeKey: "",
      volume: 0
    })));

if (includeWine) {
  for (let i = 0; i < wineItems.length && wineAdded < requiredWines; i++) {
    const wine = wineItems[i];
    if (total + wine.price <= maxBudget) {
      items.push(wine);
      total += wine.price;
      wineAdded++;
    }
  }

  // לא דורשים wineAdded === requiredWines — נמשיך גם אם נכנסו פחות
}


    if (!isNaN(dessertCount) && dessertCount > 0) {
      for (let i = 0; i < shuffledDesserts.length && dessertAdded < dessertCount; i++) {
        const dessert = shuffledDesserts[i];
        if (total + dessert.price <= maxBudget) {
          items.push(dessert);
          total += dessert.price;
          dessertAdded++;
        }
      }
    }

    while (total < maxBudget) {
      let itemAdded = false;

      for (let item of shuffled) {
        if (total >= minBudget) break;
        if (item.category === "קינוחים") continue;

        if (total + item.price <= maxBudget) {
          items.push(item);
          total += item.price;
          itemAdded = true;
          if (total >= minBudget) break;
        }
      }

      if (!itemAdded) break;
    }

    if (total >= minBudget && total <= maxBudget) {
      bestCombo = items;
      bestTotal = total;
      break;
    }

    if (total > bestTotal && total <= maxBudget) {
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





const handleGenerate = () => {
  setDessertVolumeExceededOnce(false);
  setMainVolumeExceededOnce(false);
  setShowBudgetInput(true);
  setHideButtonPeople(true);

  const b = parseInt(budget);
  const d = parseInt(dessertCount);

  if (isNaN(b) || b < 599) {
    setErrorMessage(
      "מינימום תקציב 600₪. התפריט יבנה נטו על פי תקציב, ללא התחשבות בכמות האנשים. " +
      "באפשרותך לבחור מספר קינוחים שתרצה שיהיו כלולים בתקציב (לא חובה). בנוסף תוכל לבחור אם להכניס יין. 💃 הזמנה נעימה"
    );
    setShowError(true);
    return;
  }

  setHideButtonPeople(false);
  setLoading(true);
  setShowResultsModal(false);
  setResults([]);

  setTimeout(() => {
    const rawMenus = generateMenus(b, d, includeWine);

    const normalizedMenus = rawMenus.map(menu => ({
      ...menu,
      items: (menu.items || []).map(item => ({
        name: item.name,
        price: Number(item.price),
        category: item.category || "",
        label: item.label || "",
        sizeKey: item.sizeKey || "",
        volume: Number(item.volume || 0)
      })),
      total: menu.total || (menu.items || []).reduce((sum, i) => sum + i.price, 0)
    }));

    setResults(normalizedMenus);
    setShowResultsModal(true);
    setShowBudgetInput(false);
    setLoading(false);
  }, 500);
};





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

  const mainVolume = (p * 2) + 5;
  const dessertVol = p % 2 === 0 ? (p * 0.5)+1 : (p * 0.5)+1.5;


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
setShowBudgetChat(false);//סגירה של באדגאט

};




const handleAddItemWithVolume = (item) => {
  const updatedResults = [...results];
  const currentMenu = updatedResults[0];
  const { volume = 0, category } = item;
    console.log("📦 התקבל פריט:", item);

  // ✅ תוספת מיוחדת: אם התקציב מעל 590 – אין מגבלת ווליום
  if (parseInt(budget) > 590) {
    currentMenu.items.unshift({
  ...item,
  label: item.label || "",
  sizeKey: item.sizeKey || "",
  category: item.category || "", // חובה!
});

    currentMenu.total += item.price;
    setResults(updatedResults);
    return;
  }

  // ✅ יין – לא מחשבים ווליום בכלל
  if (category === "יינות") {
    currentMenu.items.unshift({
  ...item,
  label: item.label || "",
  sizeKey: item.sizeKey || "",
  category: item.category || "", // חובה!
});

    currentMenu.total += item.price;
    setResults(updatedResults);
    return;
  }

  const isDessert = category === "קינוחים";

  if (isDessert) {
    if (remainingDessertVolume < volume) {
      if (!dessertVolumeExceededOnce) {
        setErrorMessage("🤸! הגעת לכמות המומלצת לקינוחים");
        setShowError(true);
        setDessertVolumeExceededOnce(true);
      }
    }
    setRemainingDessertVolume((prev) => prev - volume);
  } else {
    if (remainingVolume < volume) {
      if (!mainVolumeExceededOnce) {
        setErrorMessage("🤸!הגעת לכמות המומלצת");
        setShowError(true);
        setMainVolumeExceededOnce(true);
      }
    }
    setRemainingVolume((prev) => prev - volume);
  }

  currentMenu.items.unshift({
  ...item,
  label: item.label || "",
  sizeKey: item.sizeKey || "",
  category: item.category || "", // חובה!
});

  currentMenu.total += item.price;
  setResults(updatedResults);

  const key = `${item.name}-${item.label || ""}`;
setItemQuantities((prev) => ({
  ...prev,
  [key]: (prev[key] || 0) + 1,
}));

};







useEffect(() => {
  localStorage.setItem("results", JSON.stringify(results)); // results הוא מערך
}, [results]);

useEffect(() => {
  localStorage.setItem("budget", budget); // budget הוא מחרוזת או מספר, לא צריך JSON
}, [budget]);

useEffect(() => {
  localStorage.setItem("people", people); // budget הוא מחרוזת או מספר, לא צריך JSON
}, [people]);

  
useEffect(() => {
  
//localStorage.clear();
  localStorage.setItem("budgetChatOpen", showBudgetChat ? "true" : "false");
}, [showBudgetChat]);



useEffect(() => {
  localStorage.setItem("showSavedMenus", showSavedMenus ? "true" : "false");
}, [showSavedMenus]);

useEffect(() => {
  localStorage.setItem("showMyOrders", showMyOrders ? "true" : "false");
}, [showMyOrders]);

useEffect(() => {
  localStorage.setItem("showSettingsPanel", showSettingsPanel ? "true" : "false");
}, [showSettingsPanel]);

useEffect(() => {
  localStorage.setItem("activeModal", activeModal || "");
}, [activeModal]);

  useEffect(() => {
  localStorage.setItem("showResultsModal", showResultsModal ? "true" : "false");
}, [showResultsModal]);
   
useEffect(() => {
  localStorage.setItem("remainingVolume", remainingVolume); // budget הוא מחרוזת או מספר, לא צריך JSON
}, [remainingVolume]);

useEffect(() => {
  localStorage.setItem("remainingDessertVolume", remainingDessertVolume); // budget הוא מחרוזת או מספר, לא צריך JSON
}, [remainingDessertVolume]);



  return (
    <header className=/* {`navbar ${scrolling ? " shrink" : ""}`} */ 'navbar'>
    
<div className="navbar-section navbar-right">

<Menu
setShowLoyaltyModal={setShowLoyaltyModal}
setShowBudgetChat={setShowBudgetChat}
setShowSavedMenus={setShowSavedMenus}
setShowSettingsPanel={setShowSettingsPanel}
activeModal={activeModal}
setActiveModal={setActiveModal}
setShowMyOrders={setShowMyOrders} // ✅ תעביר את זה!
user={user}
loading ={loading}
setLoading={setLoading}
setUser={setUser}

/>
 </div>

{/*       <NavBarCenter openContactModal={() => setShowModal(true)} />
 */} 
 
  {/* מרכז עם לוגו ושמאל הלוגו */}
  <div className="navbar-center-wrapper">
    {/* שמאל של הלוגו */}
    <div className="navbar-section navbar-left">
                <p className="footer-link-item" onClick={() => setShowContact(true)}>צור קשר</p>
      <button className="start-text-button" onClick={() => setShowBudgetChat(true)}>
        start
      </button>
    </div>

    {/* הלוגו עצמו */}
    <div className="navbar-section navbar-center">
      <Link to="/">
        <img src={logo} className="logo" onClick={()=>setShowLoyaltyModal(false)} />
      </Link>
    </div>
  </div>

{showMyOrders && <MyOrdersModal onClose={() => setShowMyOrders(false)}
openBudgetChat ={() => setShowBudgetChat(true)}
setActiveModal={setActiveModal}
/>}


<AuthManager
  setShowMyOrders={setShowMyOrders}
  activeModal={activeModal}
  setActiveModal={setActiveModal}
onLoginSuccess={() => {
   const saved = localStorage.getItem("results");
  setResults(saved ? JSON.parse(saved) : []);
  setDraftName("");
}}

/>
  

     



<SettingsPanel
  isOpen={showSettingsPanel}
  onOpen={() => setShowSettingsPanel(true)}
  onClose={() => setShowSettingsPanel(false)}
/>

<BudgetChat

errorMessage={errorMessage}
setErrorMessage={setErrorMessage}
showError={showError}
setShowError={setShowError}
loading={loading} 
setDessertCount={setDessertCount}
dessertCount={dessertCount}
setHideButtonPeople={setHideButtonPeople}
hideButtonPeople={hideButtonPeople}
hideButtonBudget={hideButtonBudget}
setHideButtonBudget={setHideButtonBudget}
includeWine={includeWine}
setIncludeWine={setIncludeWine}
setShowBudgetInput={setShowBudgetInput}
showBudgetInput={showBudgetInput}
showPeopleInput={showPeopleInput}
setShowPeopleInput={setShowPeopleInput}
handleVolumeMode={handleVolumeMode}
handleGenerate={handleGenerate}
 setActiveModal ={setActiveModal}
 activeModal={activeModal}
setShowSavedMenus={setShowSavedMenus}
  isOpen={showBudgetChat}
  setIsOpen={setShowBudgetChat}
  draftName={draftName}
  setDraftName={setDraftName}
  results  = {results}
  setResults = {setResults}
  people={people}
  budget={budget}
  setPeople={setPeople}
  setBudget={setBudget}
  itemQuantities={itemQuantities}
setItemQuantities={setItemQuantities}
  />


  


      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
   <SavedMenus
  key={user?._id}
  isOpen={showSavedMenus}
  onClose={() => setShowSavedMenus(false)}
  onLoadMenu={(loadedMenu) => {
    const enrichedItems = (loadedMenu.items || []).map((item) => {
      const fullItem = (fullMenu[item.category] || []).find(i => i.name === item.name);
      return {
        ...item,
        sizes: fullItem?.sizes || {} // שחזור ה־sizes מהתפריט המלא
      };
    });

    const newQuantities = {};
    enrichedItems.forEach((item) => {
      const key = `${item.name} - ${item.label}`;
      newQuantities[key] = (newQuantities[key] || 0) + 1;
    });

    setItemQuantities(newQuantities);
    setResults([{
      name: loadedMenu.name || "תפריט אישי",
      items: enrichedItems,
      total: loadedMenu.total || enrichedItems.reduce((sum, i) => sum + i.price, 0)
    }]);

    setBudget("");
    setPeople("");
    setDessertCount(0);
    setIncludeWine(false);
    setShowSavedMenus(false);
    setShowResultsModal(true);
  }}
  user={user}
  loading={loading}
  setLoading={setLoading}
  openBudgetChat={() => setShowBudgetChat(true)}
  SwitchToRegister={switchToRegisterViaModal}
  itemQuantities={itemQuantities}
  setItemQuantities={setItemQuantities}
/>



{showResultsModal && (
      <ResultsModal

      setActiveModal={setActiveModal}
       activeModal={activeModal} 
      /* פעולות */
       handleAddItemWithVolume={handleAddItemWithVolume}
      handleVolumeMode={handleVolumeMode}
      handleGenerate={handleGenerate}
      /* סוף פעולות */
      showFullMenu={showFullMenu}
      setShowFullMenu={setShowFullMenu}      
      setShowSavedMenus={setShowSavedMenus}
itemQuantities={itemQuantities}
setItemQuantities={setItemQuantities}
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        results={results}
        setResults={setResults}
        budget={budget}
        setBudget={setBudget}
        people={people}
        setPeople={setPeople}
        dessertCount={dessertCount}
        setDessertCount={setDessertCount}
        includeWine={includeWine}
        setIncludeWine={setIncludeWine}
        loading={loading}
         showDraftSaved={showDraftSaved}
  setShowDraftSaved={setShowDraftSaved}
  remainingVolume={remainingVolume}
setRemainingVolume={setRemainingVolume}
remainingDessertVolume={remainingDessertVolume}
setRemainingDessertVolume={setRemainingDessertVolume} 
        />
       ) }



      {showContact && <ContactMenu onClose={() => setShowContact(false)} />}

     
    </header>
    
  );
  
};

export default NavBar;

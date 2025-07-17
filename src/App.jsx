import React, { useState , useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
;import DessertsPage from "./componnents/DessertsPage";
import MenuSection from "./pages/MenuSection";
import NavBar from "./componnents/NavBar";
import Footer from "./componnents/Footer";
import Section from "./componnents/Section";
import SplashAnimation from "./hooks/SplashAnimation"; // ✅ ייבוא ה-Splash
import ImageLinks from "./componnents/ImageLinks";
import PromoBanner from "./componnents/promo/PromoBanner";
import LoyaltyModal from "./componnents/promo/LoyaltyModal"; // ✅ ייבוא המודל


import "./App.css";



 
export default function DairyRestaurantWebsite() {
  const [splashDone, setSplashDone] = useState(false); // ✅ שליטה האם להראות את האתר
    const [showLoyaltyModal, setShowLoyaltyModal] = useState(false); // ✅
const [showBudgetChat, setShowBudgetChat] = useState(() => {
  const saved = localStorage.getItem("budgetChatOpen");
  return saved === "true"; // אם כן – תפתח אוטומטית
});

useEffect(() => {
  
//localStorage.clear();
  localStorage.setItem("budgetChatOpen", showBudgetChat ? "true" : "false");
}, [showBudgetChat]);

  return (
    <>
      {/* Splash Animation  בסוף להפעיל את השורה מטה */}
      {!splashDone && <SplashAnimation onFinish={() => setSplashDone(true)} />}

      {/* האתר עצמו */}
      {splashDone && (
         
        <div
          style={{
            width: "100vw",
            minHeight: "100vh",
            backgroundColor: "#FFF7D4",
            color: "#333",
              overflowX:"hidden",
              
              

          }}
        >

               {/* מערכת הניווט */}
      <Routes>
      <Route path="/תפריט" element={<MenuSection />} />
     
      <Route path="/desserts" element={<DessertsPage />} />
    </Routes>
          {/* Header */}
         

          {/* Section */}
          <Section />
 <NavBar 
 showBudgetChat ={showBudgetChat}
 setShowBudgetChat={setShowBudgetChat}
 />
     {showLoyaltyModal && (
            <LoyaltyModal onClose={() => setShowLoyaltyModal(false)} 
            setShowBudgetChat={setShowBudgetChat}/>
          )}

 {!showLoyaltyModal && (
            <>
              <PromoBanner onClick={() => setShowLoyaltyModal(true)} />
              <ImageLinks />
            </>
    
  )}
          {/* Footer */}
          <Footer />
        </div>
      

      )}
    </>
  );
}

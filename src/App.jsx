import React, { useState , useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
;import DessertsPage from "./componnents/DessertsPage";
import MenuSection from "./pages/MenuSection";
import NavBar from "./componnents/NavBar";
import Footer from "./componnents/Footer";
import Section from "./componnents/Section";
import SplashAnimation from "./hooks/SplashAnimation"; // ✅ ייבוא ה-Splash
import ImageLinks from "./componnents/ImageLinks/ImageLinks";
import PromoBanner from "./componnents/promo/PromoBanner";
import LoyaltyModal from "./componnents/promo/LoyaltyModal"; // ✅ ייבוא המודל
import useAuthSync from "./hooks/useAuthSync"; // ✅ ייבוא חסר
import BakeryModal from "./componnents/ImageLinks/BakeryModal"; // ✅ ייבוא חסר
import HostingPlattersModal from "./componnents/ImageLinks/HostingPlattersModal"; // ✅ ייבוא חסר

 



import "./App.css";



 
export default function DairyRestaurantWebsite() {
    const { user } = useAuthSync();
const [activeModal, setActiveModal] = useState(() => localStorage.getItem("activeModal") || null);

  const [splashDone, setSplashDone] = useState(false); // ✅ שליטה האם להראות את האתר
    const [showLoyaltyModal, setShowLoyaltyModal] = useState(false); // ✅
const [showBudgetChat, setShowBudgetChat] = useState(() => {
  const saved = localStorage.getItem("budgetChatOpen");
  return saved === "true"; // אם כן – תפתח אוטומטית
});

  const [showBakeryModal, setShowBakeryModal] = useState(false);
  const [showHostingPlattersModal, setHostingPlattersModal] = useState(false);

   

useEffect(() => {
  
//localStorage.clear();
  localStorage.setItem("budgetChatOpen", showBudgetChat ? "true" : "false");
}, [showBudgetChat]);

useEffect(() => {
  localStorage.setItem("activeModal", activeModal || "");
}, [activeModal]);

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
 activeModal={activeModal}
  setActiveModal={setActiveModal}
 setShowLoyaltyModal={setShowLoyaltyModal}
 showBudgetChat ={showBudgetChat}
 setShowBudgetChat={setShowBudgetChat}
 />
     {showLoyaltyModal && (
            <LoyaltyModal onClose={() => setShowLoyaltyModal(false)} 
            setShowBudgetChat={setShowBudgetChat}/>
          )}

 {!showLoyaltyModal && (
            <>
              <PromoBanner onClick={() =>
                 {
                  if(user){
                    setShowLoyaltyModal(true)
                  }else{
setActiveModal("login")
                  }
                   }} />

                       <ImageLinks 
                                    onClick={() =>
                 {
                  if(user){
                    setShowLoyaltyModal(true)
                  }else{
setActiveModal("register")
                  }
                   }}

                       onBakeryClick={() => setShowBakeryModal(true)} 
                       onHostingPlattersModalClick={() => setHostingPlattersModal(true)}/>
      {showBakeryModal && (
        <BakeryModal onClose={() => setShowBakeryModal(false)} />
      )}

  {showHostingPlattersModal && (
        <HostingPlattersModal onClose={() => setHostingPlattersModal(false)} />
      )}
      
    
            </>
    
  )}
          {/* Footer */}
          <Footer />
        </div>
      

      )}
    </>
  );
}

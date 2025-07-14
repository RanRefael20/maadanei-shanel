import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
;import DessertsPage from "./componnents/DessertsPage";
import MenuSection from "./pages/MenuSection";
import NavBar from "./componnents/NavBar";
import Footer from "./componnents/Footer";
import Section from "./componnents/Section";
import SplashAnimation from "./hooks/SplashAnimation"; // ✅ ייבוא ה-Splash
import ImageLinks from "./componnents/ImageLinks";

import "./App.css";



 
export default function DairyRestaurantWebsite() {
  const [splashDone, setSplashDone] = useState(false); // ✅ שליטה האם להראות את האתר
  

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
 <NavBar />
         

          {/* ImageLinks */}
          <ImageLinks/>
          
    

          {/* Footer */}
          <Footer />
        </div>
      

      )}
    </>
  );
}

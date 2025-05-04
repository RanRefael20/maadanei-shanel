import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import DessertsPage from "./componnents/DessertsPage";
import logo from "./logo/LL.png";
import MenuSection from "./pages/MenuSection";
import NavBar from "./componnents/NavBar";
import Footer from "./componnents/Footer";
import Section from "./componnents/section";
import SplashAnimation from "./hooks/SplashAnimation"; // ✅ ייבוא ה-Splash
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
            marginTop: "50px",
          }}
        >

               {/* מערכת הניווט */}
      <Routes>
      <Route path="/תפריט" element={<MenuSection />} />
      <Route path="/desserts" element={<DessertsPage />} />
    </Routes>
          {/* Header */}
          <NavBar />

          {/* Section */}
          <Section />

          {/* לוגו באמצע */}
          <div
            style={{
              textAlign: "center",
              backgroundColor: "#FFF7D4",
            }}
          >
            <img
              src={logo}
              alt="מעדני שנאל"
              style={{
                height: "335px",
                objectFit: "contain",
              }}
            />
          </div>
          
    

          {/* Footer */}
          <Footer />
        </div>
      )}
    </>
  );
}

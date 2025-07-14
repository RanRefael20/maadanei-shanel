import  { useEffect, useRef, useState } from "react";
import "../styles/section.css";
import useScroll from "../hooks/useScroll";
import useScrollToNextSection from "../hooks/useScrollToNextSection";
import useIsMobile from "../hooks/useIsMobile";

export default function Section() {
  const { sectionRef, scrollToNextSection } = useScrollToNextSection();
  const arrowRef = useRef(null);
  const [arrowTop, setArrowTop] = useState(0);
  const scrolling = useScroll();
  const [overlayOpacity, setOverlayOpacity] = useState(0.001);
  const isMobile = useIsMobile();

  const backgroundImages = [
    { url: "/photos/section.jpeg", height: "145vh", position: "center top 70%" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

useEffect(() => {
  if (!isMobile) {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }
}, [isMobile]); // שים לב שזה תלוי ב־isMobile

  useEffect(() => {
    const updateArrowAndOverlay = () => {
      if (!sectionRef.current || !arrowRef.current) return;
      const section = sectionRef.current;
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      const scrollInsideSection = scrollY + windowHeight - sectionTop;
      const scrollProgress = Math.min(1, Math.max(0, scrollInsideSection / sectionHeight));
      const newOpacity = 0.001 + scrollProgress * 0.8;
      setOverlayOpacity(newOpacity);

      const scrollBottom = scrollY + windowHeight;
      const distanceFromTop = scrollBottom - sectionTop;
      const maxArrowTop = sectionHeight - 80 + 105;
      const newTop = Math.min(distanceFromTop, maxArrowTop);
      setArrowTop(newTop);
    };

    updateArrowAndOverlay();
    window.addEventListener("scroll", updateArrowAndOverlay);
    return () => window.removeEventListener("scroll", updateArrowAndOverlay);
  }, [scrolling]);

  return (
    <div className="Sections">
      
      <section className="hero-sections" ref={sectionRef}>
        
     {!isMobile && backgroundImages.map((image, index) => (
  <div
    key={index}
    className={`background-layer background-layer-${index}`}
    style={{
      backgroundImage: `url(${image.url})`,
      backgroundPosition: image.position,
      height: image.height,
      opacity: currentIndex === index ? 1 : 0,
    }}
  ></div>
))}

{isMobile && (
  <video
    className="background-video"
    src="/photos/section.mp4"
    autoPlay
    loop
    muted
    playsInline
  />
)}


        {/* שכבת השחרה מעל הווידאו */}
     

  <div
          className="overlay"
          style={{ backgroundColor: `rgba(0, 0, 0, 0.44)` , height:`100%` }}
        ></div>
        <h1 className="hero-title"></h1>
        <p className="hero-subtitle"></p>

        {/* חצים */}
        <div
          className="arrow-double"
          ref={arrowRef}
          style={{ top: `${arrowTop - 130}px`, cursor: "pointer" }}
          onClick={() => {
            const offset = isMobile ? 0: 0;
            scrollToNextSection(offset);
          }}
        >
          <div className="arrow-third"></div>
        </div>

        {/* כפתור אישור השגחה */}
   {/*      <button
          className="certificate-button"
          onClick={() => window.open("/photos/certificate.jpg", "_blank", "noopener,noreferrer,width=800,height=600")}
          style={{
            top: `${arrowTop - 105}px`,
            left: isMobile ? "70%" : "calc(85% + 90px)",
            transform: "translateX(-50%)",
          }}
        >
          אישור<br />השגחה
        </button> */}

      </section>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import "../styles/footer.css";
import { FaChevronUp } from "react-icons/fa";


const Footer = () => {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const [showScrollButton, setShowScrollButton] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setShowScrollButton(window.scrollY > 400);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <>
    <footer
      className={`elevated-footer ${isVisible ? "animate-footer" : ""}`}
      ref={footerRef}
    >
      <div className="footer-container">
        <div className="footer-left">
          <h2 className="footer-brand">מעדני שנאל</h2>
          <p className="footer-tagline">❤️ אירוח שמרגישים בו את הלב</p>
          <p className="footer-contact-text">
            לשאלות והזמנות: <strong>050-322-5482</strong>
          </p>
        </div>

        <div className="footer-center">
          <div className="footer-links-row">
  {[
    "מגשי אירוח",
    "תפריטים ששמרת",
    "הזמנות שלי",
    "צור קשר",
    "הגדרות",
    "אודות",
    "אירועים",
    "הצעת מחיר",
    "בנה תפריט אישי"
  ].map((label, idx) => (
    <a key={idx} href="#" className="footer-link-item">
      {label}
    </a>
  ))}
</div>

          <div className="footer-box-row">
            {[
              "לחמי כוסמין ושיפון 100%",
              "מגשי אירוח יוקרתיים",
              "מארזים מפנקים",
              "קייטרינג חלבי לאירועים",
            ].map((text, index) => (
              <div key={index} className="footer-box">
                {text}
              </div>
            ))}
          </div>

          {/* 💡 שורת CTA */}
          <div className="cta-bar">
            הצטרפו עכשיו למועדון הלקוחות שלנו ותקבלו <span>30% חזרה</span> בכל הזמנה 🎁
            <br />
            <a
              href="https://wa.me/972503225482"
              className="cta-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              דברו איתנו
            </a>
          </div>

          {/* 💡 תמונה רספונסיבית */}

        </div>

        <div className="footer-right">
          <a
            href="https://wa.me/c/972503225482"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-fancy"
          >
            <FaWhatsapp size={20} className="whatsapp-icon" />
            קטלוג WhatsApp
          </a>
        </div>


      </div>


    </footer>
{showScrollButton && (
  <button
    className="back-to-top-text"
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    title="חזרה לראש הדף"
  >
    ⬆️ לראש העמוד
  </button>
)}

    </>
  );
};

export default Footer;

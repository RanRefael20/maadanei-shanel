import React, { useEffect, useRef, useState } from "react";
import { FaWhatsapp, FaChevronUp } from "react-icons/fa";
import "../styles/footer.css";
import ContactMenu from "./contact/ContactMenu";


const Footer = () => {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => footerRef.current && observer.unobserve(footerRef.current);
  }, []);

  return (
    <>
      <div className="footer-wrapper">
        <footer
          className={`elevated-footer ${isVisible ? "animate-footer" : ""}`}
          ref={footerRef}
        >
          <div className="footer-container">
            <div className="footer-left">
              <h2 className="footer-brand">מעדני שנאל</h2>
              <p className="footer-contact-text">
                קייטרינג חלבי לאירועים | באהבה מהמטבח שלנו
              </p>
            </div>

            <div className="footer-center">
              <div className="footer-links-row">
                {[
                  "מגשי אירוח",
                  "תפריטים ששמרת",
                  "הזמנות שלי",
                  "הגדרות",
                  "אודות",
                  "אירועים",
                  "הצעת מחיר",
                  "בנה תפריט אישי",
                    "לחמי כוסמין ושיפון 100%",
                  "מגשי אירוח יוקרתיים",
                  "מארזים מפנקים",
                  "קייטרינג חלבי לאירועים",
                ].map((label, idx) => (
                  <a key={idx} href="#" className="footer-link-item">
                    {label}
                  </a>
                ))}
                <p className="footer-link-item" onClick={() => setShowContact(true)}>צור קשר</p>

              </div>

       


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
      </div>

      {showScrollButton && (
        <button
          className="back-to-top-text"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="חזרה לראש הדף"
        >
          ⬆️ לראש העמוד
        </button>
      )}

      {showContact && <ContactMenu onClose={() => setShowContact(false)} />}

    </>
  );
};

export default Footer;

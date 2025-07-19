import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="elevated-footer">
      <div className="footer-container">
        <div className="footer-left">
          <h2 className="footer-brand">מעדני שנאל</h2>
          <p className="footer-tagline">❤️ אירוח שמרגישים בו את הלב</p>
          <p className="footer-contact-text">לשאלות והזמנות: <strong>050-322-5482</strong></p>
        </div>

        <div className="footer-center">
          <div className="footer-box-row">
            {[
              "לחמי כוסמין ושיפון 100%",
              "מגשי אירוח יוקרתיים",
              "מארזים מפנקים",
              "קייטרינג חלבי לאירועים",
            ].map((text, index) => (
              <div key={index} className="footer-box">{text}</div>
            ))}
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
  );
};

export default Footer;

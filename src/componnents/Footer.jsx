import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "../styles/footer.css"; // חיבור לקובץ העיצוב

const Footer = () => {
  return (
    <footer className="footer">
      <section className="footer-content">
        <div className="footer-boxes">
          {[
            "לחמי כוסמין ושיפון 100%",
            "מגשי אירוח",
            "מארזים מפנקים עד הפרט האחרון",
            "קייטרינג חלבי ייחודי לאירועים",
          ].map((text, index) => (
            <div key={index} className="footer-box">
              {text}
            </div>
          ))}
        </div>

        <h2 className="footer-title brand-title rubik-gemstones-regular">❤️ אירוח שמרגישים בו את הלב </h2>
        <h3 className="footer-event">
          ?חוגגים יום הולדת<br /> ?אירועי חברה? עליה לתורה
        </h3>
        <h3 className="footer-call">!הזמינו עכשיו</h3>

        <p className="footer-desc">⬇️ עיין בקטלוג המלא שלנו בוואטסאפ. לחץ מטה</p>
        <a href="https://wa.me/c/972503225482" target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
          <FaWhatsapp size={20} className="whatsapp-icon" /> WhatsApp Catalog
        </a>
        <p className="footer-contact">
          📞 להזמנות חייגו / שילחו הודעת וואטסאפ: <strong>050-322-5482</strong>
        </p>
      </section>
    </footer>
  );
};

export default Footer;

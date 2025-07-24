import React from "react";
import "./HostingPlattersModal.css";

const HostingPlattersModal = ({ onClose }) => {
  return (
    <div className="hosting-overlay">
      <div className="hosting-modal">
        <img
          className="hosting-banner"
          src="/photos/בורקיטס.jpg"
          alt="מגשי אירוח"
        />

        <div className="hosting-content">
          <h2>🍽️ מגשי האירוח של מעדני שנאל</h2>
          <p>
            <strong>מגשי האירוח שלנו</strong> הם סמל לדיוק, אלגנטיות וטעם בלתי נשכח.
            כל מגש מותאם בקפידה, במידות אישיות, מתוך הבנה עמוקה של חוויית אירוח מושלמת.
          </p>

          <p>
            אנו גאים לשלב בין <strong>מלאכת יד מוקפדת</strong> לחומרי גלם איכותיים,
            ולהגיש קולקציית מגשים מרהיבה – החל ממאפי בוטיק ועד מנות פרימיום עשירות.
          </p>

          <ul className="example-list">
            <li>🥯 בייגל בייגל – ממולאים בקפידה, עם הלחמניות הייחודיות שלנו</li>
            <li>🐟 מגשי דגים מעושנים ופרוסים באסתטיקה מרהיבה</li>
            <li>🥙 מגשי פיתות סביח אישיות – חוויה ישראלית מקורית</li>
            <li>✨ מגשי פרימיום – מנות גורמה לאירועים ברמה הגבוהה ביותר</li>
            <li>🍽️ הכל מוגש במידות קטנות, עם דגש על פרזנטציה יוקרתית</li>
          </ul>

          <p>
            אם אתם מחפשים <strong>רושם אמיתי באירוח</strong> – מגשי שנאל הם הבחירה שלכם.
          </p>

          <button className="hosting-button" onClick={onClose}>
            🧁 חזרו לעיון בתפריט
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostingPlattersModal;

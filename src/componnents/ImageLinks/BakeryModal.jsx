import React from "react";
import "./BakeryModal.css";

const BakeryModal = ({ onClose }) => {
  return (
    <div className="bakery-overlay">
      <div className="bakery-modal">
        <img
          className="bakery-banner"
          src="/photos/vv.jpg" // שנה לפי הצורך
          alt="מחלקת האפייה"
        />

        <div className="bakery-content">
          <h2>🍞 מחלקת האפייה של מעדני שנאל</h2>
          <p>
            כבר למעלה מעשור, <strong>שנאל מתמחה באפייה איכותית</strong> תוך שמירה על
            סטנדרטים גבוהים, חומרי גלם מובחרים, והתאמה אישית לכל אירוע או צורך.
          </p>

          <p>
            אנו מציעים <strong>מגוון רחב של לחמים, חלות, עוגות, פוקאצ'ות ומאפים</strong> –
            הנאפים מדי יום, בעבודת יד, עם שימת לב לכל פרט.
          </p>

          <ul className="example-list">
            <li>🥖 לחמים מחמצת טבעית במרקמים וטעמים מיוחדים</li>
            <li>🍞 חלות מתוקות, קלועות בעבודת יד, לשבתות וחגים</li>
            <li>🥐 עוגות ועוגיות במגוון סגנונות – קלאסי, מודרני ובריא</li>
            <li>🔥 כל מוצר נאפה באהבה – ועם ניסיון של שנים</li>
          </ul>

          <p>
            מחלקת האפייה שלנו נבנתה מתוך תשוקה, התמחות וניסיון –
            <strong>היא הלב הפועם של שנאל.</strong>
          </p>

          <button className="bakery-button" onClick={onClose}>
            🍰 חזרו לעיון בתפריט
          </button>
        </div>
      </div>
    </div>
  );
};

export default BakeryModal;

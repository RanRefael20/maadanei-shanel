import React from "react";
import "./LoyaltyModal.css";

const LoyaltyModal = ({ onClose  , setShowBudgetChat }) => {
  return (
    <div className="loyalty-overlay">
      <div className="loyalty-modal">
        <img
          className="loyalty-banner"
          src="/photos/אירועים.jpg" // החל לתמונה שלך
          alt="מועדון לקוחות"
        />

        <div className="loyalty-content">
          <h2>💙 מועדון הלקוחות שלנו</h2>
          <p>
            אצלנו <strong>הלקוח תמיד במקום הראשון</strong> – ולכן בנינו עבורך מערכת
            בלעדית שתשלב <strong>טעם, נוחות וחיסכון</strong> אמיתי בכל הזמנה
          </p>

          <p>
            🍽️ כל קנייה באתר מזכה אותך ב־<strong>30% חזרה כנקודות</strong> לרכישה
            הבאה. לדוגמה
          </p>

          <ul className="example-list">
            <li>💸 רכשת ב־1,000 ₪? קיבלת 300 נקודות (שוות־כסף) אוטומטית</li>
            <li>🔁 בקנייה הבאה תוכל לבחור להשתמש בכמה שתרצה מהן – אפילו בכולן</li>
            <li>🧠 השתמשת ב־300 נקודות? תשלם רק 700 ₪ – ועליהם תצבור שוב 30%</li>
          </ul>

          <p>
            הצטרף עכשיו ותרוויח <strong>בכל הזמנה מחדש</strong> –
            פשוט, נוח, ומשתלם
          </p>

          <button className="try-button" onClick={()=>{
            onClose()
            setShowBudgetChat(true)
          }}>
            🚀 נסה עכשיו עם 30% הנחה
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyModal;

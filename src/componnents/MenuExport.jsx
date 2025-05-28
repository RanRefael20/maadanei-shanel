import React, { useState, useEffect } from "react";
  import CreditModal from "./CreditModal";
import ReactDOM from "react-dom";
import "../styles/MenuExport.css";
import "../styles/CreditModal.css";

const MenuExport = ({ selectedItems, onClose, onMinimize, onBackToEdit, userData }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    birthdate: "",
    address: ""
  });

  const [showPayment, setShowPayment] = useState(false);
const [showCreditModal, setShowCreditModal] = useState(false);



  // טוען נתונים מה-DB או props בעת פתיחת הרכיב
  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        email: userData.email || "",
        phone: userData.phone || "",
        birthdate: userData.birthdate || "",
        address: ""
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return ReactDOM.createPortal(
    <div className="menu-export-overlay">
      <div className="menu-export-window">
        <div className="menu-export-header">
          <span>סיכום הזמנה</span>
          <div className="menu-export-controls">
            <button onClick={onClose}>✖</button>
          </div>
        </div>

        <div className="menu-export-body">
          <h3>1) פרטי משתמש להזמנה:</h3>
          <div className="form-group">
            <label>שם:</label>
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>אימייל:</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>טלפון:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>תאריך לידה:</label>
            <input type="date" name="birthdate" value={formData.birthdate} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>כתובת:</label>
            <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
          </div>

          <hr />

          {selectedItems.length === 0 ? (
            <p>לא נבחרו פריטים.</p>
          ) : (
            <>
              <ul className="menu-export-list">
                <h3>2) פירוט הזמנה:</h3>
                {selectedItems.map((item, index) => (
                  <li key={index}>
                    {item.name} - {item.price} ₪
                  </li>
                ))}
              </ul>
              <div className="menu-export-total">
                סך הכול: {selectedItems.reduce((sum, item) => sum + item.price, 0)} ₪
              </div>
            </>
          )}

          <div className="menu-export-buttons">
<button onClick={() => setShowCreditModal(true)}>תשלום באשראי 💳</button>
            <button onClick={onBackToEdit}>חזרה לעריכת תפריט 🔁</button>
            <button onClick={onClose}>אישור ושליחה ✅</button>
          </div>
        </div>
      </div>
{showCreditModal && (
  <CreditModal
    totalAmount={selectedItems.reduce((sum, item) => sum + item.price, 0)}
    onClose={() => setShowCreditModal(false)}
    onSuccess={() => {
      setShowCreditModal(false);
      onClose(); // סגירה מלאה אחרי תשלום
    }}
  />
)}


    </div>,
    
    document.getElementById("modal-root")
  );
};

export default MenuExport;

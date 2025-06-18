import React, { useState } from "react";
import "../styles/CreditModal.css";
import visaLogo from "../assets/visa.png";
import masterLogo from "../assets/mastercard.png";
import LoadingSpinner from "./LoadingSpinner";





const CreditModal = ({ totalAmount, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    holder: "",
  });


  36.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = () => {
    const { cardNumber, expiry, cvv, holder } = formData;
    if (!cardNumber || !expiry || !cvv || !holder) {
      alert("נא למלא את כל השדות");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert("✅ תשלום בוצע בהצלחה (דמו)");
      onSuccess();
    }, 2000);
  };

  return (
    <div className="credit-modal-overlay">
      <div className="credit-modal">
        <div className="credit-header">
          <h3>פרטי תשלום</h3>
          <div className="card-icons">
            <img src={visaLogo} alt="Visa" />
            <img src={masterLogo} alt="MasterCard" />
           
          </div>
        </div>

        <div className="credit-form">
          <label>מספר כרטיס</label>
          <input
            type="text"
            name="cardNumber"
            placeholder="**** **** **** ****"
            value={formData.cardNumber}
            onChange={handleChange}
            maxLength={19}
          />

          <div className="credit-row">
            <div>
              <label>תוקף</label>
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={handleChange}
                maxLength={5}
              />
            </div>

            <div>
              <label>CVV</label>
              <input
                type="text"
                name="cvv"
                placeholder="3 ספרות"
                value={formData.cvv}
                onChange={handleChange}
                maxLength={3}
              />
            </div>
          </div>

          <label>שם בעל הכרטיס</label>
          <input
            type="text"
            name="holder"
            placeholder="השם המלא"
            value={formData.holder}
            onChange={handleChange}
          />
        </div>

        <div className="total-display">
          סכום לתשלום: <strong>{totalAmount} ₪</strong>
        </div>

        {isProcessing ? (
     <LoadingSpinner text="... מאמת עם חברת האשראי" />
        ) : (
          <div className="credit-buttons">
            <button onClick={onClose}>❌ ביטול</button>
            <button onClick={handlePayment}>✅ אשר תשלום</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditModal;

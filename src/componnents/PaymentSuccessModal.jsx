import React, { useEffect, useState } from "react";
import "../styles/PaymentSuccessModal.css";

const PaymentSuccessModal = ({ successMessage, onClose, onViewOrder   }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const openTimer = setTimeout(() => setShow(true), 500); // הופעה חלקה
    const closeTimer = setTimeout(() => {
      setShow(false);
      if (onClose) onClose(); // סגירה אוטומטית
     window.location.reload();
    }, 10000);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  if (!show) return null;
    const handleManualClose = () => {
    setShow(false);
    if (onClose) onClose();
   window.location.reload(); // ✅ רענון גם בלחיצה ידנית
  };

  return (
    <div className="payment-success-overlay">
      <div className="payment-success-modal">
        <button className="payment-close-button" onClick={handleManualClose}>✖</button>
        <div className="payment-icon">🎉</div>
        <h2>התשלום הושלם בהצלחה!</h2>
        <p className="payment-message">{successMessage}</p>
        <div className="payment-actions">
{/*                               <button className="menu-action-button" onClick={()=>showorder()} >
הרשם בחינם          </button>
          <button className="view-order-button" onClick={onViewOrder}>
            הצג את ההזמנה שלך
          </button> */}

        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;

import React, { useState } from "react";
import "../styles/CreditModal.css";
import visaLogo from "../assets/visa.png";
import masterLogo from "../assets/mastercard.png";
import LoadingSpinner from "./LoadingSpinner";
import useAuthSync from "../hooks/useAuthSync";
import { baseURL } from "../config"; // או הנתיב המתאים אצלך
import PaymentSuccessModal from "../componnents/PaymentSuccessModal";
import RegisterErrorModal from "../login/Eror/RegisterErrorModal";





const CreditModal = ({ totalAmount, selectedItems = [], onClose, userPoints = 0 , userInformationToOrder,
  activeModal,
  setActiveModal,

   }) => {
  const resetAfterPayment = () => {
  // איפוס מה־localStorage
  localStorage.removeItem("results");
  localStorage.removeItem("budget");
  localStorage.removeItem("people");
  
  localStorage.removeItem("showResultsModal");
  localStorage.removeItem("budgetChatOpen");
  // איפוס סטייטים
};
  const { user } = useAuthSync();

  const [formData, setFormData] = useState({
    cardNumber: "123",
    expiry: "123",
    cvv: "123",
    holder: "עומר",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
const [paymentSuccess, setPaymentSuccess] = useState(false);
const [successMessage, setSuccessMessage] = useState("");
 const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);


  const maxPoints = Math.min(userPoints, totalAmount);
  const finalAmount = totalAmount - (usePoints ? pointsToUse : 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    const { cardNumber, expiry, cvv, holder } = formData;
      if (!cardNumber || !expiry || !cvv || !holder) {
      alert("נא למלא את כל השדות");
      return;
    }
    // ✅ תשלום בפועל מול חבר סליקה
const paymentRes = await fetch(`${baseURL}/api/payment/start`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    amount: finalAmount,
    username: userInformationToOrder.username || user?.username || formData.holder,
    email: userInformationToOrder.email || user?.email || "noemail@guest.com",
    productDescription: "הזמנה ממעדני שנאל"
  }),
});

if (!paymentRes.ok) {
  const errMsg = await paymentRes.text();
  throw new Error("❌ לא הצלחנו ליצור לינק תשלום: " + errMsg);
}

const { paymentUrl } = await paymentRes.json();
window.open(paymentUrl, "_blank")

  
  
   setIsProcessing(true);
  
    try {
      // ⚙️ שליחת ההזמנה לשרת
      const token = localStorage.getItem("token");
  
      const orderData = {
        
        username: userInformationToOrder.username || user?.username || formData.holder,
        email: userInformationToOrder.email || user?.email || "noemail@guest.com",
        phone: userInformationToOrder.phone || user?.phone || "ללא מספר",
        address: userInformationToOrder.address || user?.address || "כתובת לא זמינה",
        items: selectedItems, // או מה שעובר מ־props
        priceFirst:totalAmount,
        usedPoints: usePoints ? pointsToUse : 0,
        totalPrice: finalAmount,
        when: userInformationToOrder.when
        
      };
  
      // ✍️ שמירה בדאטהבייס
      const createRes = await fetch(`${baseURL}/api/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(orderData),
      });
  
      if (!createRes.ok) {
  const errorText = await createRes.json();
  setErrorMessage(errorText.message )
  setShowError(true)
  console.error("❗ שגיאה מהשרת:", errorText);
    return
}
      const savedOrder = await createRes.json();
  
      // 📧 שליחת מיילים
      await fetch(`${baseURL}/api/send-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: savedOrder.email,
          subject: "🧾 ההזמנה שלך התקבלה - מעדני שנאל",
          order: savedOrder,
          sendBy: "email",
          status: "after",
        }),
      });


  
      // 📲 יצירת לינק לוואטסאפ
       const whatsappRes = await fetch(`${baseURL}/api/send-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: savedOrder.phone || "0500000000",
          subject: "קישור להזמנה ממעדני שנאל",
          order: savedOrder,
          sendBy: "whatsapp",
          status: "after",
        }),
      });

      if (!whatsappRes.ok) throw new Error("שליחת וואטסאפ נכשלה");

      const { whatsappUrl } = await whatsappRes.json();
     // window.open(whatsappUrl, "_blank"); // פותח את וואטסאפ
  const accumulated = finalAmount * 0.3;
  const baseMessage = `✅ תשלום בוצע בהצלחה\nשולם בפועל: ₪${finalAmount.toFixed(2)}`;
  resetAfterPayment();
  const successText = user
  ? `${baseMessage}\nצברת: ₪${accumulated.toFixed(2)}`
  : `${baseMessage}\n${userInformationToOrder.username || user?.username || formData.holder} ,  אם היית רשום אצלנו באתר היית יכול לצבור  ₪${accumulated.toFixed(2)} שישמשו אותך לקנייה באה  ✨`;
  setSuccessMessage(successText)
  setPaymentSuccess(true);

    } catch (err) {
      console.error("❌ שגיאה בתשלום:", err);
      alert("אירעה שגיאה בתשלום. נסה שוב.");
    } finally {
      setIsProcessing(false);
    }
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

          <div className="points-section">
            <label>
              <input
                type="checkbox"
                checked={usePoints}
                 onChange={() => {
                  const newUsePoints = !usePoints;
                  setUsePoints(newUsePoints);
                  setPointsToUse(newUsePoints ? Math.min(userPoints, totalAmount) : 0);
                }}
              />
              אני רוצה לממש נקודות
            </label>

            {usePoints && (
              <>
                <small>
                  יש לך {userPoints} נקודות. ניתן לממש עד {maxPoints}
                </small>
                <input
                  type="number"
                  min="0"
                  max={maxPoints}
                  value={pointsToUse}
                  onChange={(e) => {
                    const val = Math.min(Number(e.target.value), maxPoints);
                    setPointsToUse(val);
                  }}
                  placeholder={`מימוש עד ${maxPoints}`}
                />
              </>
            )}
          </div>
        </div>

        <div className="total-display">
          סכום לתשלום: <strong>₪{finalAmount}</strong>
        </div>
        {isProcessing ? (
          <LoadingSpinner text="... מאמת עם חברת האשראי" />
        ) : (
          <div className="credit-buttons">
            <button onClick={onClose}>❌ ביטול</button>
            <button onClick={handlePayment}>✅ אשר תשלום</button>
          </div>
          
        )}
{paymentSuccess&&(
 <PaymentSuccessModal
 activeModal={ activeModal}
  setActiveModal={setActiveModal}
onClose={()=> setPaymentSuccess(false)}
successMessage={successMessage}
 />
)}
          {showError && (
        <RegisterErrorModal
          onClose={() => setShowError(false)}
          errorMessage={errorMessage}
                 
        />
        
      )}
      </div>
    </div>
  );
 
};
 

export default CreditModal;

import React, { useState, useEffect } from "react";
import CreditModal from "../CreditModal";
import ReactDOM from "react-dom";
import "./MenuExport.css";
import "../../styles/CreditModal.css";
import useAuthSync from "../../hooks/useAuthSync";
import LoadingSpinner from "../LoadingSpinner";
import { baseURL } from "..//./../config"; // או הנתיב המתאים אצלך
import RegisterErrorModal from "../../login/Eror/RegisterErrorModal";





const MenuExport = ({ selectedItems,  onBackToEdit  , setActiveModal ,
 activeModal  }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuthSync();
  const [message, setMessage] = useState("");
  const [showSendOptions, setShowSendOptions] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [hideMessagePermanently, setHideMessagePermanently] = useState(false);


  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    when:"",
    to:"",
    title:"",
    notes:"",

  });

  const [sendData, setSendData] = useState({
    sendPhone: "",
    sendEmail: "",
  });

useEffect(() => {
  if (user) {
    setFormData((prev) => ({
      ...prev,
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      // שימור when אם הוזן לפני
      when: prev.when || "",
    }));
  }
}, [user]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendDataChange = (e) => {
    const { name, value } = e.target;
    setSendData((prev) => ({ ...prev, [name]: value }));
  };

 const validateForm = () => {
  if (!formData.username.trim()) {
    setMessage("❌ חובה להזין שם ");
    return false;
  }
  if (!formData.email.includes("@")) {
    setMessage("❌ אימייל לא תקין");
    return false;
  }
  if (formData.phone && !/^\d{9,10}$/.test(formData.phone)) {
    setMessage("❌ מספר טלפון לא תקין");
    return false;
  }
  if (!formData.address.trim()) {
    setMessage("❌ נא להזין כתובת תקינה");
    return false;
  }
  if (!formData.when) {
    setMessage("❌ נא לבחור תאריך למתי תרצו את ההזמנה");
    return false;
  }

 const now = new Date();
const [year, month, day, hour, minute] = formData.when.split(/[-T:]/).map(Number);
const selectedDate = new Date(year, month - 1, day, hour, minute);
const diffInHours = (selectedDate - now) / (1000 * 60 * 60);
  if (diffInHours < 23) {
    setMessage("❌ נא לבחור תאריך לפחות 24 שעות מעכשיו");
    return false;
  }

  return true;
};


  const handleSendOrder = async (method) => {
    console.log(method);
    
    if (method === "email" && (!sendData.sendEmail || !sendData.sendEmail.includes("@"))) {
      setMessage("❌ כתובת מייל לא תקינה");
      return;
    }

    if (method === "whatsapp" && (!sendData.sendPhone || !/^\d{9,10}$/.test(sendData.sendPhone))) {
      setMessage("❌ מספר טלפון לא תקין");
      return;
    }

    setIsProcessing(true);
    setMessage(method === "email" ? "📤 שולח למייל..." : "📤 פותח WhatsApp...");      
    try {
            // שליחה מקדימה לפני תשלום - מייל להתייעצות

      const res = await fetch(`${baseURL}/api/send-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: method === "email" ? sendData.sendEmail : sendData.sendPhone,
          subject: "🤔 מה דעתך על התפריט שבחרתי?",
          sendBy: method,
          status: "before",
          order: {
            name: formData.username,
            phone: formData.phone,
            address: formData.address,
            items: selectedItems,
            total: selectedItems.reduce((sum, item) => sum + item.price, 0),
            to: formData.to,
            title: formData.title,
            notes: formData.notes
          },
        }),
      });

      const data = await res.json();
      setIsProcessing(false);
console.log(data)
      if (res.ok) {
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, "_blank");
          setMessage("✅ הועבר לוואטסאפ");
        } else {
          setMessage("✅ ההזמנה נשלחה בהצלחה!");
        }
      } else {
        setMessage("❌ שגיאה: " + (data.message || ""));
      }
    } catch (err) {
      setIsProcessing(false);
      setMessage("❌ שגיאת שרת בשליחה");
    }
  };


  return ReactDOM.createPortal(
    <div className="menu-export-overlay">
      <div className="menu-export-window">
        <div className="menu-export-header">
          <span>סיכום הזמנה</span>
          <div className="menu-export-controls">
            <button onClick={onBackToEdit}>✖</button>
          </div>
        </div>

        <div className="menu-export-body">
          {!showSendOptions ? (
            <>
              <h3>1) פרטים להזמנה:</h3>
              <div className="form-group">
  <label>למתי אתם רוצים את ההזמנה:</label>
  <input
    type="datetime-local"
    name="when"
    
    value={formData.when}
    onChange={handleInputChange}
  />
</div>

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
                <label>כתובת למשלוח:</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
              </div>
              {message && <div className="settings-message">{message}</div>}

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
                <button onClick={() => {
                  if(user){
                    if(validateForm()===true)   setShowCreditModal(true)
                   }else{
                   if (!hideMessagePermanently){ 
                    setSuccessMessage(`
  <div dir="rtl" style="text-align: right; direction: rtl;">
  <strong style="font-size: 16px;">⚠️ שים לב! אתה רגע לפני ביצוע תשלום – אך לא מחובר למערכת</strong><br />
  <div style="margin-top: 8px;">
    כדי ליהנות מהטבת <strong style="color: #2b7de9;">מועדון הלקוחות</strong> – החזר של <strong>30% מההזמנה</strong> בצורת נקודות – עליך להיות מחובר למערכת.
  </div>
  <div style="margin-top: 6px; color: red; font-weight: bold;">
    כרגע אינך מחובר – וחבל שתפסיד את ההטבה!
  </div>

  <hr style="margin: 10px 0; border: none; border-top: 1px solid #ccc;" />

  <strong style="font-size: 15px;">מה ניתן לעשות?</strong>
<ol style="padding-right: 20px; font-size: 14px; margin-top: 6px; line-height: 1.8;">
  <li>✨ בתחתית העמוד תמצא כפתור <strong style="color: #2b7de9;">התחברות / הרשמה</strong>.</li>
  <li>🔐 כבר רשום? <strong>התחבר</strong> בקלות. חדש אצלנו? לחץ על <strong style="color: #2b7de9;">"הרשם"</strong> בתחתית החלון.</li>
  <li>💫 אחרי ההתחברות, תחזור <strong>בדיוק לאותו מקום</strong> – עם כל הפריטים שכבר בחרת 🎉.</li>
  <li>💾 שמור את התפריט כטיוטה חכמה – ותחזור אליו מתי שתרצה, בלי תלות בהזמנה.</li>
</ol>


  <hr style="margin: 10px 0; border: none; border-top: 1px solid #ccc;" />

  <div style="font-size: 14px;">
    כך תוכל להשלים את ההזמנה ולהבטיח <strong style="color: green;">30% החזר</strong> על הרכישה 💚
  </div>

  <div style="margin-top: 6px; font-style: italic; font-size: 13.5px;">
    אנחנו תמיד כאן בשבילך – לכל שאלה או עזרה 🙂
  </div>
</div>

      `);
      setShowSuccess(true);
                   } else{
                    if(validateForm()===true)   setShowCreditModal(true)
                   }

                  }
                  }
              
              }>תשלום באשראי 💳</button>
                <button onClick={onBackToEdit}>חזרה לעריכת תפריט 🔁</button>
                <button onClick={() => setShowSendOptions(true)}>שלח הצעה 📤</button>
              </div>
            </>
          ) : (
            <div className="send-options">
              <h4>היי , לפני שאתה מזמין - כאן תוכל לשלוח את התפריט למי שאתה רוצה ולשמוע מה דעתו על התפריט שהכנת </h4>
              <h3>שליחת פרטי ההזמנה:</h3>
                  <div className="form-group">
                <label>למי אתה שולח?</label>
                <input
                placeholder="שם המקבל"
                  type="text"
                  name="to"
                  value={formData.to}
                  onChange={handleInputChange}
                />
              </div>
                  <div className="form-group">
                <label>כותרת פנימית</label>
                <input
                placeholder="הצעת מחיר \ טיוטת תפריט"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
                  <div className="form-group">
                <label>הערות נוספות</label>
                <input
                placeholder="הערות \ הודעה נוספת"
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
        {/*       <div className="form-group">
                <label>לשליחה בוואטסאפ:</label>
                <input
                placeholder="הזן מספר טלפון אליו תרצה לשלוח"
                  type="text"
                  name="sendPhone"
                  value={sendData.sendPhone}
                  onChange={handleSendDataChange}
                />
              </div> */}
              <div className="form-group">
                <label>לשליחה במייל:</label>
                <input
                placeholder="הזן כתובת מייל תקינה - שים לב שהכתובת תקינה לפני שאתה שולח "
                  type="email"
                  name="sendEmail"
                  value={sendData.sendEmail}
                  onChange={handleSendDataChange}
                />
              </div>
              <div className="menu-export-buttons">
{/*                 <button onClick={() => handleSendOrder("whatsapp")}>שליחה ב־WhatsApp 📲</button>
 */}                <button onClick={() => handleSendOrder("email")}>שליחה למייל 📧</button>
                <button onClick={() => setShowSendOptions(false)}>↩ חזרה</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreditModal && (
        
 <CreditModal
  userInformationToOrder={formData}
  selectedItems={selectedItems}
  totalAmount={selectedItems.reduce((sum, item) => sum + item.price, 0)}
  userPoints={user?.points || 0}
  onClose={() => setShowCreditModal(false)}/>
  
      )}

      {message && (
        <LoadingSpinner result={message} setMessage={setMessage} />
      )}

      {showSuccess && (
  <RegisterErrorModal
    onClose={() => setShowSuccess(false)}
    errorMessage={successMessage}
setHideMessagePermanently={setHideMessagePermanently}
setShowSuccess={setShowSuccess}
    source="MenuExport"
    setActiveModal={setActiveModal}

  />
)}

    </div>,
    document.getElementById("modal-root")
  );
};

export default MenuExport;

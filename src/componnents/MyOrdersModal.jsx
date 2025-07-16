import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "../styles/MyOrdersModal.css";
import { baseURL } from "../config";
import LoadingSpinner from "../componnents/LoadingSpinner";
import useAuthSync from "../hooks/useAuthSync"; // ✅ ייבוא חסר
import RegisterErrorModal from "../login/Eror/RegisterErrorModal";


const MyOrdersModal = ({ onClose  , openBudgetChat , setActiveModal     }) => {
  const [orders, setOrders] = useState([]);
 const {user , loading , setLoading } = useAuthSync();
 const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
    const [expireDate, setExpireDate] = useState("");
    const [searchDate, setSearchDate] = useState("");
const [searchEmail, setSearchEmail] = useState("");
const [searchPhone, setSearchPhone] = useState("");
const [searchNumber, setSearchNumber] = useState("");


const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("🔒 עליך להתחבר כדי לצפות בהזמנות שלך.");
    }

    const endpoint = user?.email === "nashelcheese@gmail.com"
      ? "/api/orders/all-orders"
      : "/api/orders/my-orders";

    const res = await fetch(`${baseURL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        throw new Error("🔒 עליך להתחבר כדי לצפות בהזמנות שלך.");
      } else {
        throw new Error(data.message || "שגיאה בלתי צפויה בשליפת ההזמנות.");
      }
    }

    if (!Array.isArray(data)) {
      throw new Error("מבנה נתונים לא צפוי מהשרת.");
    }

    setOrders(data);

  } catch (err) {
    console.error("❌ שגיאה בשליפת ההזמנות:", err);
    setErrorMessage(err.message);
    setShowError(true);
  } finally {
    setLoading(false);
  }
};



useEffect(() => {
  fetchOrders();
}, [user])

const formatDate = (date) =>
  new Date(date).toLocaleDateString("he-IL");

const formatTime = (date) =>
  new Date(date).toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });

const filteredOrders = orders.filter((order) => {
  const orderDate = formatDate(order.createdAt);
  const orderEmail = order.email?.toLowerCase() || "";
  const orderPhone = order.phone || "";
  const orderNumber = (order.orderNumber || order._id || "").toString();

  return (
    orderDate.includes(searchDate) &&
    (!searchEmail || orderEmail.includes(searchEmail.toLowerCase())) &&
    (!searchPhone || orderPhone.includes(searchPhone)) &&
    (!searchNumber || orderNumber.includes(searchNumber))
  );
});



useEffect(() => {
  if (filteredOrders.length > 0) {
    const createdAt = new Date(filteredOrders[0].createdAt);
    createdAt.setMonth(createdAt.getMonth() + 3);

    // השווה אם התאריך החדש באמת שונה מהקיים
    if (!expireDate || createdAt.getTime() !== new Date(expireDate).getTime()) {
      setExpireDate(createdAt);
    }
  }
}, [filteredOrders]);


const handleDeleteOrder = async (orderId) => {
  if (!window.confirm("האם אתה בטוח שברצונך למחוק את ההזמנה?")) return;
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${baseURL}/api/orders/${orderId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("שגיאה במחיקת ההזמנה");
    setOrders((prev) => prev.filter((o) => o._id !== orderId));
  } catch (err) {
    alert(err.message);
  }
};



  return ReactDOM.createPortal(
    <> 
        {showError && (
        <RegisterErrorModal
          onClose={() => setShowError(false)}
          errorMessage={errorMessage}
          type="error"
          source="MyOrders"
          setActiveModal={setActiveModal}
        />
      )}
      
    <div className="orders-modal-overlay">
      <div className="orders-modal">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2>📦 ההזמנות שלי</h2>
        {user?.email === "nashelcheese@gmail.com" && (
  <>
    <input
      type="text"
      placeholder="חפש לפי מייל"
      className="order-search"
      value={searchEmail}
      onChange={(e) => setSearchEmail(e.target.value)}
    />
    <input
      type="text"
      placeholder="חפש לפי טלפון"
      className="order-search"
      value={searchPhone}
      onChange={(e) => setSearchPhone(e.target.value)}
    />
    <input
      type="text"
      placeholder="חפש לפי מספר הזמנה"
      className="order-search"
      value={searchNumber}
      onChange={(e) => setSearchNumber(e.target.value)}
    />
  </>
)}

        <input
          type="text"
          className="order-search"
          placeholder="חפש לפי תאריך (dd/mm/yyyy)"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
{filteredOrders.length > 0 && (
  
  <p className="points-banner">
    🟡 ניתן לממש נקודות עד{" "}
    {new Date(expireDate)
      .toLocaleDateString("he-IL")}
  </p>
)}
        
{loading ? (
  <LoadingSpinner />
) : filteredOrders.length === 0 ? (
  <>
    {!user ? (
      <div className="input-row ">
        <p>לא נמצאו הזמנות</p>
        <button
          className="menu-action-button"
          onClick={() => {
            fetchOrders();
            setLoading(true);
          }}
        >
          לאחר התחברות לחץ כאן
        </button>
      </div>
    ) : user.email !== "nashelcheese@gmail.com" ? (
      <div className="no-orders-container">
        <p className="no-orders-text">עדיין לא ביצעת הזמנה</p>
        <button
          className="start-order-button"
          onClick={() => {
            openBudgetChat();
            onClose();
          }}
        >
          📦 התחל להזמין עכשיו ולצבור נקודות לפעם הבאה!
        </button>
      </div>
    ) : null}
  </>
) : (
  <ul className="orders-list">
    {filteredOrders.map((order, i) => (
      <li key={order._id} className="order-item">
        <strong>#{i + 1}</strong>
        <div className="order-header">
          
           <strong>🧾 מספר הזמנה  {order.orderNumber}</strong>

          <div
          className="created"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            נוצר ב-
            <span>📅 {formatDate(order.createdAt)}</span>
            <span>🕒 {formatTime(order.createdAt)}</span>
          </div>
        </div>
       
        <div>
          📅הוזמן ל: {formatDate(order.when)} בשעה:{" "}
          {formatTime(order.when)}
        </div>
        <div>🧾 מחיר לפני הנחה: {order.priceFirst} ₪</div>
        <div>🎁 מומשו בהזמנה זו: {order.usedPoints} ₪</div>
        <div>💳 שולם בפועל לאחר הנחה: {order.totalPrice} ₪</div>
        <div>🌟 בהזמנה זו צברת : {order.earnedPoints} ₪ </div>
        <div>📧 מייל: {order.email}</div>
        <div>📞 טלפון: {order.phone}</div>
        <div>📍 כתובת: {order.address}</div>
        <div>🧺 פריטים:</div>
        <ul className="items-list">
          {order.items.map((item, j) => (
            <li key={j}>
              • {item.name} ({item.quantity})
            </li>
          ))}
        </ul>
        {user?.email === "nashelcheese@gmail.com" && (
          <button
            className="delete-order-button"
            onClick={() => handleDeleteOrder(order._id)}
          >
            ❌ מחק הזמנה
          </button>
        )}
      </li>
    ))}
  </ul>
)}

        
      </div>
      
    </div>
    
    </>,
    
    document.body
    
  );
};
 
export default MyOrdersModal; 



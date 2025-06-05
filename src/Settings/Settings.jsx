import React, { useState, useEffect, forwardRef } from "react";
import "./Settings.css";
import { baseURL } from "../config"; // או הנתיב המתאים אצלך
import useAuthSync from "../hooks/useAuthSync";


const Settings = forwardRef((props, ref) => {


const { user, loading, setUser, setLoading } = useAuthSync();
  

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    birthdate: "",
    address: "" // ✅ שדה כתובת חדש
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [showNewPasswordInput, setShowNewPasswordInput] = useState(false);
  const [message, setMessage] = useState("");




useEffect(() => {
  
  if (user) {

    setFormData({
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      birthdate: user.birthdate ? user.birthdate.substring(0, 10) : "",
      address: user.address || "",
    });
    setLoading(false);
  }
}, [user]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "currentPassword" || name === "newPassword") {
      setPasswords((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setMessage("❌ חובה להזין שם משתמש");
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
    if (showNewPasswordInput && passwords.newPassword.length < 6) {
      setMessage("❌ סיסמה חדשה חייבת להיות לפחות 6 תווים");
      return false;
    }
    return true;
  };

  const checkCurrentPassword = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${baseURL}/api/verify-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword: passwords.currentPassword }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage("❌ סיסמה נוכחית שגויה");
      return false;
    }

    setShowNewPasswordInput(true);
    setMessage("✅ סיסמה אומתה, ניתן להזין סיסמה חדשה");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    const payload = {
      ...formData,
      password: passwords.newPassword || undefined,
    };

    try {
      
      
      const res = await fetch(`${baseURL}/api/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        
      });
      console.log("1212");

      const text = await res.text();
       console.log(text);
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("השרת החזיר תשובה לא תקינה");
      }

      if (!res.ok) throw new Error(data.message);
      setMessage("✅ הפרטים עודכנו בהצלחה");
      
    } catch (err) {
      setMessage("❌ שגיאה: " + err.message);
    }
  };

  return (
    <div className="settings-container">
      <h2>שינוי הגדרות</h2>
      {loading ? (
        <p>טוען נתונים...</p>
      ) : (
        <form onSubmit={handleSubmit} className="settings-form">
          <input type="text" name="username" placeholder="שם משתמש" value={formData.username} onChange={handleChange} autoComplete="username" />
          <input type="email" name="email" placeholder="אימייל" value={formData.email} onChange={handleChange} autoComplete="email" />
          <input type="tel" name="phone" placeholder="טלפון" value={formData.phone} onChange={handleChange} autoComplete="tel" />
          <input type="text" name="address" placeholder="כתובת" value={formData.address} onChange={handleChange} autoComplete="street-address" />
          <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />

          <input
            type="password"
            name="currentPassword"
            placeholder="הכנס סיסמה נוכחית כדי לשנות סיסמה"
            autoComplete="current-password"
            value={passwords.currentPassword}
            onChange={handleChange}
          />
          {!showNewPasswordInput && (
            <button type="button" onClick={checkCurrentPassword} className="save-button">אמת סיסמה</button>
          )}

          {showNewPasswordInput && (
            <input
              type="password"
              name="newPassword"
              placeholder="סיסמה חדשה"
              autoComplete="new-password"
              value={passwords.newPassword}
              onChange={handleChange}
            />
          )}

          <button type="submit" className="save-button">שמור שינויים</button>
          {message && <div className="settings-message">{message}</div>}
        </form>
      )}
    </div>
  );
});

export default Settings;

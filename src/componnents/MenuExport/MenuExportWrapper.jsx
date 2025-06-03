// MenuExportWrapper.jsx
import React, { useEffect, useState } from "react";
import MenuExport from "./MenuExport";
import { baseURL } from "../../config";

const MenuExportWrapper = ({ selectedItems, onClose, onMinimize, onBackToEdit }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${baseURL}/api/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("שגיאה בשליפת פרטי משתמש");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("שגיאה:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "1.2rem" }}>
        ⏳ טוען פרטי משתמש...
      </div>
    );
  }

  return (
    <MenuExport
      selectedItems={selectedItems}
      onClose={onClose}
      onMinimize={onMinimize}
      onBackToEdit={onBackToEdit}
      userData={userData} // מועבר לתוך MenuExport
    />
  );
};

export default MenuExportWrapper;

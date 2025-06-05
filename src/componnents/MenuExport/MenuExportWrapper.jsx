// MenuExportWrapper.jsx
import React, { useEffect, useState } from "react";
import MenuExport from "./MenuExport";
import useAuthSync from "../../hooks/useAuthSync"; // ודא שהנתיב נכון

const MenuExportWrapper = ({ selectedItems, onClose, onMinimize, onBackToEdit }) => {
    const { user: userData, loading } = useAuthSync(); // ← שואב את כל הפרטים




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

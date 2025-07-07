// MenuExportWrapper.jsx
import React from "react";
import MenuExport from "./MenuExport";
import useAuthSync from "../../hooks/useAuthSync"; // ודא שהנתיב נכון
import LoadingSpinner from "../LoadingSpinner";

const MenuExportWrapper = ({ selectedItems, onClose, onMinimize, onBackToEdit    }) => {
  const { user: userData, loading } = useAuthSync(); // שימוש נכון ב-loading מתוך ה-hook
  if (loading) {
    return (
      <LoadingSpinner text="טוען פרטי משתמש..." />
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

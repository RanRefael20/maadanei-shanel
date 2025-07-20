// MenuExportWrapper.jsx
import React from "react";
import MenuExport from "./MenuExport";
import useAuthSync from "../../hooks/useAuthSync"; // ודא שהנתיב נכון
import LoadingSpinner from "../LoadingSpinner";

const MenuExportWrapper = ({ selectedItems,  onBackToEdit , setActiveModal,
 activeModal  }) => {
  const { user: userData, loading } = useAuthSync(); // שימוש נכון ב-loading מתוך ה-hook
  if (loading) {
    return (
      <LoadingSpinner text="טוען פרטי משתמש..." />
    );
  }
  return (
    
    <MenuExport
     setActiveModal ={setActiveModal}
 activeModal={activeModal}
      selectedItems={selectedItems}
      onBackToEdit={onBackToEdit}
      userData={userData} // מועבר לתוך MenuExport
    />
  );
};

export default MenuExportWrapper;

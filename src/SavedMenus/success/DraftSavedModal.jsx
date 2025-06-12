import React, { useState } from "react";
import ReactDOM from "react-dom";
import "../success/DraftSavedModal.css";

const DraftSavedModal = ({ onClose, onConfirmSave }) => {
  const [draftName, setDraftName] = useState("");

  const handleSave = () => {
    if (!draftName.trim()) return;
    onConfirmSave(draftName); // קריאה לפונקציית השמירה
    onClose(); // סגור את המודאל
  };

  return ReactDOM.createPortal(
    <div className="draft-saved-overlay">
      <div className="draft-saved-modal">
        <h2>💾 שמירת טיוטה</h2>
        <p>הזן שם לטיוטה שלך:</p>

        <input
          type="text"
          placeholder="הזן שם לתפריט"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          className="draft-name-input"
        />

        <div className="draft-saved-buttons">
          <button className="confirm-button" onClick={handleSave}>
            שמור טיוטה
          </button>
          <button className="close-button" onClick={onClose}>
            ביטול
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DraftSavedModal;

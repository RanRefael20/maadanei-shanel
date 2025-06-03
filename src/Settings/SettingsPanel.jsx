import React, { useState } from "react";
import Settings from "./Settings";
import "./SettingsPanel.css";

const SettingsPanel = ({ onOpen }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    console.log("נלחץ כפתור ההגדרות");
        

    if (!showModal && typeof onOpen === "function") onOpen();
    setShowModal((prev) => !prev);
  };

  return (
    <div className="settings-panel-wrapper">
      <button className="settings-toggle-button" onClick={toggleModal}>
        הגדרות משתמש
      </button>

      {showModal && (
        <div className="settings-modal-overlay" onClick={toggleModal}>
          <div
            className="settings-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="settings-close-button"
              onClick={toggleModal}
            >
              ✖
            </button>
            <Settings />
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;

import React from "react";
import Settings from "./Settings";
import "./SettingsPanel.css";

const SettingsPanel = ({ isOpen, onOpen, onClose }) => {
  return (
    <>


      {isOpen && (
        <div className="settings-modal-overlay" onClick={onClose}>
          <div
            className="settings-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="settings-close-button"
            onClick={onClose}
            >
              ✖
            </button>
            <Settings />
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsPanel;

// RegisterErrorModal.jsx
import ReactDOM from "react-dom";
import "./RegisterErrorModal.css";

const RegisterErrorModal = ({ onClose, errorMessage, message, actions , IdmenuToDelete }) => {
  return ReactDOM.createPortal(
    <div className="error-overlay">
      <div className="error-modal">
     
          <button className="error-close-button" onClick={onClose}>✖</button>
      
        <h2 className="error-title">  שגיאה</h2>
        <p className="error-message">{errorMessage || message|| "אירעה שגיאה לא ידועה."}</p>
     {/* ✅ אם יש actions – הצג כפתורים */}
        {IdmenuToDelete !== null && (
          <div className="error-actions">
            {actions.map((action, index) => (
              <button
                key={index}
                className="error-action-button"
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default RegisterErrorModal;

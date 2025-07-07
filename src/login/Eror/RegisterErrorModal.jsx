import ReactDOM from "react-dom";
import "./RegisterErrorModal.css";

const RegisterErrorModal = ({ onClose, errorMessage, message, actions, IdmenuToDelete, type, source , setActiveModal  }) => {
  const token = localStorage.getItem("token");

  return ReactDOM.createPortal(
    <div className="error-overlay">
{      <div className={`error-modal ${type === "success" ? "modal-success" : "modal-error"}`}>
        <button className="error-close-button" onClick={onClose}>✖</button>
       <h2 className="error-title">
  {type === "success"
    ? "הצלחה"
    : source === "budget"
    ? "שימו לב"
    : "שגיאה"}
</h2>
        <p className="error-message"> 
{source==="MyOrders" &&(
   
      <button  className="link-button" 
       onClick={() => {
        setActiveModal("login")
              onClose();
          }}
             >
            התחבר
          </button>
)}
    
               {errorMessage || message || "אירעה שגיאה לא ידועה."}</p>
         
        {IdmenuToDelete !== null && token && actions?.length > 0 && (
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
      </div>}
    </div>,
    document.body
  );
};

export default RegisterErrorModal;

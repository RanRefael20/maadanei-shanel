import ReactDOM from "react-dom";
import "./RegisterErrorModal.css";

const RegisterErrorModal = ({
  setShowSuccess,
setHideMessagePermanently,
  onClose, errorMessage, message, actions, IdmenuToDelete, type, source , setActiveModal  }) => {
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
        <div className="error-message" dangerouslySetInnerHTML={{ __html: errorMessage || message || "אירעה שגיאה לא ידועה." }} />
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

{source==="MenuExport" &&(
        <button className="menu-action-button" onClick={() => {
                  setShowSuccess(false);
                  setHideMessagePermanently(true);
                }}>סגור</button>
)}
    
              <div/>
         
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

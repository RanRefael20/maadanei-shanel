import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import "../styles/BudgetChat.css";
import ResultsModal from "./ResultsModal"; // או הנתיב הנכון אצלך
import FullMenuSelector from "./FullMenuSelector";
import LoadingSpinner from "./LoadingSpinner";
import useAuthSync from "../hooks/useAuthSync";
import RegisterErrorModal from "../login/Eror/RegisterErrorModal";








Modal.setAppElement("#root");

const BudgetChat=({isOpen,setIsOpen,results,setResults,budget,people, setPeople,setBudget,setItemQuantities,itemQuantities,showSavedMenus,setShowSavedMenus,setActiveModal,activeModal,
  showFullMenu,
  setShowFullMenu,
  handleGenerate,
  handleVolumeMode,
  showBudgetInput,
showPeopleInput,
includeWine,
setIncludeWine,
setShowBudgetInput,
setShowPeopleInput,
hideButtonBudget,
setHideButtonBudget,
setHideButtonPeople,
hideButtonPeople,
setDessertCount,
dessertCount,
showError,
setShowError,
loading,
errorMessage,



}) => {



 
  return (
    <>
          <Modal

       isOpen={isOpen}
  onRequestClose={()=>{
       setIsOpen(false)
              setShowBudgetInput(false)
                    setHideButtonPeople(false)
                        setHideButtonBudget(false)
                      setShowPeopleInput(false)
                      setPeople("")
                      setBudget("")
                      setDessertCount("")
                      setIncludeWine("")
                      localStorage.setItem("budgetChatOpen", "false");
                      
  }}  contentLabel="AI Menu Modal"
  ariaHideApp={false}
  style={{
          content: {
            height: window.innerWidth <= 450 ? showBudgetInput ?"55%": "40%" : "50%",
            width: "85%",
            top: window.innerWidth <= 450 ? "40%" : "56%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "800px",
            backgroundColor: "#000000e3",
            padding: window.innerWidth <= 600 ? "1rem" : "2rem",
            borderRadius: "16px",
            direction: "rtl",
            overflowY: "auto",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 98,
          },
        }}
      >
                  <button className="close-button" onClick={() => {setIsOpen(false)
                    setShowBudgetInput(false)
                    setHideButtonPeople(false)
                        setHideButtonBudget(false)
                      setShowPeopleInput(false)
                      setPeople("")
                      setBudget("")
                      setDessertCount("")
                      setIncludeWine("")
                      localStorage.setItem("budgetChatOpen", "false");
                  }}>❌</button>

        <div className="budget-input-section">
          <h2 className="budget-title">באפשרותך לבנות תפריט לפי תקציב או לפי כמות סועדים</h2>
{showBudgetInput&&(
  <>
  הזן תקציב
     <input
     
            type="number"
            className="budget-input"
            placeholder="הכנס תקציב ב-₪"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
הכנס מספר קינוחים (לא חייב)
             <input
            type="number"
            className="budget-input"
            placeholder="כמה קינוחים (או השאר ריק)"
            value={dessertCount}
            onChange={(e) => setDessertCount(e.target.value)}
          />

  <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeWine}
              onChange={(e) => setIncludeWine(e.target.checked)}
            />
            רוצים יין?
          </label>
        </>  
   )}
     
     {showPeopleInput&&(
          <input
            type="number"
            className="budget-input"
            placeholder="מספר סועדים"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          />

     )}
          {!hideButtonBudget &&(
   <button className="generate-button" onClick={handleGenerate}>
            צור תפריט לפי תקציב
          </button>
          )}
       
          {!hideButtonPeople&&(
          <button className="generate-button" onClick={handleVolumeMode}>
           צור תפריט לפי כמות אנשים (יותר מדיוק)
          </button>
          )}

 
        </div>
       
      </Modal>
 
      


           {showError && (
        <RegisterErrorModal
          onClose={() => setShowError(false)}
          errorMessage={errorMessage}
          source={"budget"}        
        />
        
      )}

      {showFullMenu && (
<FullMenuSelector
  onClose={() => setShowFullMenu(false)}
        setItemQuantities={setItemQuantities}
itemQuantities={itemQuantities}
/>

      )}

{loading && ReactDOM.createPortal(
  <LoadingSpinner />,
  document.getElementById('root') // או document.body
)}
    </>
  );
};

export default BudgetChat;

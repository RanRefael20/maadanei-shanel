import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./UsersModal.css";
import { baseURL } from "../config";
import useAuthSync from "../hooks/useAuthSync";
import RegisterErrorModal from "../login/Eror/RegisterErrorModal";
import LoadingSpinner from "../componnents/LoadingSpinner"; // עדכן לפי הנתיב אצלך


const UsersModal = ({ onClose, setActiveModal }) => {
  const { user } = useAuthSync();
  const [users, setUsers] = useState([]);
  const [adminPassword, setAdminPassword] = useState("");
  const [authRequired, setAuthRequired] = useState(false);
  const [actionType, setActionType] = useState(""); // delete or update
  const [selectedUser, setSelectedUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
const [showSuccess, setShowSuccess] = useState(false);



  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseURL}/api/users/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "שגיאה בשליפת המשתמשים");
      setUsers(data);
    } catch (err) {
      setErrorMessage(err.message);
      setShowError(true);
    }
  };

  useEffect(() => {
    if (user?.email === "nashelcheese@gmail.com") {
      fetchUsers();
    }
  }, [user]);

  const filteredUsers = users.filter((u) => {
    return (
      (!searchName || u.username?.includes(searchName)) &&
      (!searchPhone || u.phone?.includes(searchPhone))
    );
  });

const requestAction = (type, u) => {
  setSelectedUser(u);
  setActionType(type);
  setAdminPassword(""); // אפס את הסיסמה בכל פעם
  setAuthRequired(true);
};


const confirmAction = async () => {
  try {

    if (isProcessing) return;
setIsProcessing(true);

    const token = localStorage.getItem("token");

    // שליחת סיסמה לשרת
    const res = await fetch(`${baseURL}/api/users/verify-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password: adminPassword }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "סיסמת מנהל שגויה");
    }

    // פעולה לאחר אימות בלבד
    if (actionType === "delete") {
      const delRes = await fetch(`${baseURL}/api/users/${selectedUser._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!delRes.ok) throw new Error("שגיאה במחיקת המשתמש");

      setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
      setSuccessMessage("🗑️ המשתמש נמחק בהצלחה");
      setShowSuccess(true);
      setTimeout(() => {
  setShowSuccess(false);
  setSuccessMessage("");
}, 3000);


    }

    if (actionType === "update") {
      // ולידציה``````
      const { username, phone, email } = selectedUser;
      if (!username || !phone || !email) {
        throw new Error("יש למלא את כל השדות הנדרשים");
      }
      if (!email.includes("@")) {
        throw new Error("כתובת מייל לא תקינה");
      }

      const updRes = await fetch(`${baseURL}/api/users/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: selectedUser.username.trim(),
          email: selectedUser.email.trim(),
          phone: selectedUser.phone.trim(),
          address: selectedUser.address?.trim() || "",
          points: selectedUser.points ?? 0,
        }),
      });
if (selectedUser.points < 0) {
  throw new Error("מספר נקודות לא יכול להיות שלילי");
}

      if (!updRes.ok) throw new Error("שגיאה בעדכון המשתמש");

      const updated = await updRes.json();
      setUsers((prev) =>
        prev.map((u) => (u._id === updated._id ? updated : u))
      );
      setSuccessMessage("✅ המשתמש עודכן בהצלחה");
setShowSuccess(true);
setTimeout(() => {
  setShowSuccess(false);
  setSuccessMessage("");
}, 3000);

    }
  } catch (err) {
    setErrorMessage(err.message);
    setShowError(true);
  } finally {
    // אפס תמיד אחרי פעולה
    setSelectedUser(null);
    setActionType("");
    setAdminPassword("");
    setAuthRequired(false);
    setIsProcessing(false);

  }
};



  return ReactDOM.createPortal(
    <>
      {showError && (
        <RegisterErrorModal
          onClose={() => setShowError(false)}
          errorMessage={errorMessage}
          type="error"
          source="UsersModal"
          setActiveModal={setActiveModal}
        />
      )}

      <div className="users-modal-overlay">
        <div className="users-modal">
          <button className="close-button" onClick={onClose}>✖</button>
          <h2>👤 ניהול משתמשים</h2>

          <input
            type="text"
            placeholder="חפש לפי שם"
            className="user-search"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            type="text"
            placeholder="חפש לפי טלפון"
            className="user-search"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
          />

          <ul className="users-list">
            {filteredUsers.map((u) => (
  <li key={u._id} className="user-item">
    <div>
      <strong>שם:</strong>{" "}
      <input
        value={u.username}
        onChange={(e) =>
          setUsers((prev) =>
            prev.map((user) =>
              user._id === u._id ? { ...user, username: e.target.value } : user
            )
          )
        }
      />
    </div>
    <div>
      <strong>מייל:</strong>{" "}
      <input
        value={u.email}
        onChange={(e) =>
          setUsers((prev) =>
            prev.map((user) =>
              user._id === u._id ? { ...user, email: e.target.value } : user
            )
          )
        }
      />
    </div>
    <div>
      <strong>טלפון:</strong>{" "}
      <input
        value={u.phone}
        onChange={(e) =>
          setUsers((prev) =>
            prev.map((user) =>
              user._id === u._id ? { ...user, phone: e.target.value } : user
            )
          )
        }
      />
    </div>
    <div>
      <strong>כתובת:</strong>{" "}
      <input
        value={u.address}
        onChange={(e) =>
          setUsers((prev) =>
            prev.map((user) =>
              user._id === u._id ? { ...user, address: e.target.value } : user
            )
          )
        }
      />
    </div>
    <div>
  <strong>נקודות:</strong>{" "}
  <input
    type="number"
    value={u.points ?? 0}
    onChange={(e) =>
      setUsers((prev) =>
        prev.map((user) =>
          user._id === u._id
            ? { ...user, points: Number(e.target.value) }
            : user
        )
      )
    }
  />
</div>


    <div className="user-actions">
     <button
        className="edit-user-button"
        onClick={() => requestAction("update", u)}
        disabled={authRequired}
      >
        ✏️ עדכן משתמש
      </button>
       <button
        className="delete-user-button"
        onClick={() => requestAction("delete", u)}
        disabled={authRequired}
      >
        ❌ מחק משתמש
      </button>
    </div>
  </li>
))}

          </ul>

          {authRequired && (
            <div className="admin-auth-box">
              <input
                type="password"
                className="admin-password"
                placeholder="הזן סיסמת מנהל"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <button className="confirm-admin-action" onClick={confirmAction}>
                אשר פעולה
              </button>
            </div>
          )}
          {isProcessing && (
  <div className="spinner-container">
    <LoadingSpinner />
  </div>
)}
{showSuccess && (
  <RegisterErrorModal
    onClose={() => setShowSuccess(false)}
    errorMessage={successMessage}
    type="success"
    source="UsersModal"
    setActiveModal={setActiveModal}
  />
)}


        </div>
      </div>
    </>,
    document.body
  );
};

export default UsersModal;

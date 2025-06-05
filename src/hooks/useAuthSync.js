// hooks/useAuthSync.js
import { useEffect, useState } from "react";
import { baseURL } from "../config";

const useAuthSync = () => {
  const [user, setUser] = useState(null); // null = לא מחובר
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      console.log("token from useAuth 👨‍💻 " + token)
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${baseURL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    


        if (!res.ok) {
          console.warn("🔐 טוקן לא תקף, מוחק...");
          localStorage.removeItem("token");
          setUser(null);
        } else {
          const data = await res.json();
          if (data && data._id) {
            console.log("✅ התחברות הצליחה:", data);
            const { _id, username, email, phone, birthdate, address } = data;
            setUser({ _id, username, email, phone, birthdate, address });
          } else {
            console.warn("⚠️ לא הוחזר משתמש תקף:", data);
            localStorage.removeItem("token");
            setUser(null);
          }
        }
      } catch (err) {
        console.error("❌ שגיאה באימות טוקן:", err);
        localStorage.removeItem("token");
        setUser(null);
      }

      setLoading(false);
    };

    checkToken();
  }, []);
  return { user, loading, setUser, setLoading };
};

export default useAuthSync;

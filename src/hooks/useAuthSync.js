// hooks/useAuthSync.js
import { useEffect, useState } from "react";
import { baseURL } from "../config";

const useAuthSync = () => {
  const [user, setUser ] = useState(null); // null = לא מחובר
  const [ loading , setLoading] = useState(null); // null = לא מחובר
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
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

    };

    checkToken();
  }, []);
  return { user, setUser, loading , setLoading};
};

export default useAuthSync;

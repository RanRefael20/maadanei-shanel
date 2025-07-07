import { useEffect, useState, useCallback } from "react";
import { baseURL } from "../config";

const useAuthSync = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkToken = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
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

      if (res.status === 401 || res.status === 403) {
        console.warn("🔐 טוקן לא תקף – מוחק...");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setUser(null);
      } else if (!res.ok) {
        console.error("⚠️ שגיאה זמנית בשרת – לא מוחק טוקן");
      } else {
        const data = await res.json();
        if (data && data._id) {
          setUser(data);
          
        } else {
          console.warn("⚠️ לא הוחזר משתמש תקף – מוחק...");
          localStorage.removeItem("token");
          setUser(null);
        }
      }
    } catch (err) {
      console.error("❌ שגיאה באימות טוקן:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  return { user, setUser, loading, setLoading, checkToken };
};

export default useAuthSync;

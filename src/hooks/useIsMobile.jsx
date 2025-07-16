import { useState, useEffect } from "react";

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 750);
    };

    checkMobile(); // בדיקה מיידית כשהקומפוננטה עולה

    window.addEventListener("resize", checkMobile); // האזנה לשינויים בגודל

    return () => window.removeEventListener("resize", checkMobile); // ניקוי מאזין
  }, []);

  return isMobile;
}

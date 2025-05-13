import React, { useEffect, useState } from "react";
import "../styles/splash.css";

export default function SplashAnimation({ onFinish }) {  // <<< מוסיפים כאן onFinish
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onFinish) onFinish(); // <<< ברגע שמסתיים, קוראים ל-onFinish
    }, 1); // 10 שניות
    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!show) return null;

  const title = "מעדני שנאל"; // שורה ראשונה
  const subtitle = "מגשי אירוח יוקרתיים"; // שורה שנייה

  return (
    <div className="splash-animation">
      <div className="splash-title">
        {title.split("").map((letter, index) => (
          <span
            key={index}
            className="splash-letter"
            style={{ animationDelay: `${index * 0.15}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className="splash-subtitle">
        {subtitle.split("").map((letter, index) => (
          <span
            key={index}
            className="splash-letter"
            style={{
              animationDelay: `${(title.length * 0.15) + index * 0.15 + 0.5}s`
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}

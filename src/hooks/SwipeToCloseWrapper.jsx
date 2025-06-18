import React, { useRef, useState } from 'react';

const SwipeToCloseWrapper = ({ onClose, setOverlayOpacity, children }) => {
  const startY = useRef(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

if (diff > 0) {
  setTranslateY(diff);

  // עדכון שקיפות של המודל עצמו
  const newOpacity = Math.max(1 - diff / (window.innerHeight / 1.2), 0.3);
  setOverlayOpacity(newOpacity); // עדכון של ה־overlay מבחוץ
}

  };

  const handleTouchEnd = () => {
    const halfScreen = window.innerHeight / 2;

    if (translateY > halfScreen) {
      setTranslateY(window.innerHeight);
      setTimeout(() => {
        onClose();
        reset();
      }, 200);
    } else {
      setTranslateY(0);
      reset();
    }
  };

  const reset = () => {
    setIsDragging(false);
      setOverlayOpacity(0.9); // מחזיר את הרקע לשקיפות רגילה

  };

  // מחשב שקיפות לפי מרחק – 1 זה אטום, 0 זה שקוף לגמרי
  const opacity = Math.max(1 - translateY / (window.innerHeight / 1.2), 0.3);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: 'none',
        transform: `translateY(${translateY}px)`,
        opacity: opacity,
        transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
        height: '100%',
      }}
    >
      {children}
    </div>
  );
};

export default SwipeToCloseWrapper;

import React, { useRef, useState } from 'react';

const SwipeToCloseWrapper = ({ onClose, children }) => {
  const startY = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 100) {
      setIsDragging(false);
      onClose(); // סגירה
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none', height: '100%' }}
    >
      {children}
    </div>
  );
};

export default SwipeToCloseWrapper;

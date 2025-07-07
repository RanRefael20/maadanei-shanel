import React, { useRef, useState } from 'react';

const SwipeToCloseWrapper = ({ onClose, setOverlayOpacity, children }) => {
  const startY = useRef(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const wrapperRef = useRef(null);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    const scrollableEl = wrapperRef.current;

    const isAtTop =
      scrollableEl &&
      scrollableEl.scrollTop <= 0;

    // נרצה לאפשר swipe רק אם גולשים כלפי מטה מהחלק העליון
    if (diff > 0 && isAtTop) {
      setTranslateY(diff);
      const newOpacity = Math.max(1 - diff / (window.innerHeight / 1.2), 0.3);
      setOverlayOpacity(newOpacity);
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
    setOverlayOpacity(0.9);
  };

  const opacity = Math.max(1 - translateY / (window.innerHeight / 1.2), 0.3);

  return (
    <div
      ref={wrapperRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: 'pan-y',
        transform: `translateY(${translateY}px)`,
        opacity: opacity,
        transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
        height: '100%',
        overflowY: 'auto', // חשוב לגלילה!
        WebkitOverflowScrolling: 'touch', // תמיכה באייפון
      }}
    >
      {children}
    </div>
  );
};

export default SwipeToCloseWrapper;

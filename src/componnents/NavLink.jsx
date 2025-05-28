import React from 'react';
import "../styles/NavLink.css";
import useScroll from '../hooks/useScroll';




const NavLink = ({ openContactModal }) => {
  const scrolling = useScroll();

  return (
    <div className={`nav-links-container${scrolling ? " shrink" : ""}`}>
      <a href="/" className={`nav-button${scrolling ? " shrink" : ""}`}>דף הבית</a>
      <a href="/אודות" className={`nav-button${scrolling ? " shrink" : ""}`}>אודות</a>
      <a href="/תפריט" className={`nav-button${scrolling ? " shrink" : ""}`}>תפריט</a>




      {/* צור קשר מפעיל את המודל במקום ניווט */}
    <button
  className={`nav-button${scrolling ? " shrink" : ""}`}
  onClick={openContactModal}
>
  צור קשר
</button>
    </div>
  );
};

export default NavLink;

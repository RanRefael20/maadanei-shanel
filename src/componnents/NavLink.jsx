import React from 'react'
import "../styles/NavLink.css";
import { Link } from "react-router-dom";
import useScroll from '../hooks/useScroll';

const NavLink = () => {
  const scrolling = useScroll(); // נשתמש ב-hook
  return ( 
    
      <div className= {`nav-links-container${scrolling ? " shrink" : ""}`} >
      
     <Link to="/דף הבית" className= {`nav-button${scrolling ? " shrink" : ""}`}>דף הבית</Link>      
      <Link to="/אודות" className= {`nav-button${scrolling ? " shrink" : ""}`}>אודות</Link>      
      <Link to="/תפריט" className= {`nav-button${scrolling ? " shrink" : ""}`}>תפריט</Link>      
      <Link to="/צור קשר" className= {`nav-button${scrolling ? " shrink" : ""}`}>צור קשר</Link>      
    </div>
  )
}

export default NavLink
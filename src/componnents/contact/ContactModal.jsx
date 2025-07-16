// components/ContactModal.jsx
import React from "react";
import ReactDOM from "react-dom";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import "../contact/ContactModal.css";

const ContactModal = ({ onClose }) => {
  return ReactDOM.createPortal(
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>✖</button>
        <h2>צור קשר</h2>
        <a href="https://wa.me/972503225482" target="_blank" rel="noopener noreferrer" className="contact-button whatsapp">
          <FaWhatsapp size={20} /> WhatsApp - צ'אט
        </a>
        <a href="https://wa.me/c/972503225482" target="_blank" rel="noopener noreferrer" className="contact-button whatsapp">
          <FaWhatsapp size={20} /> WhatsApp קטלוג
        </a>
        <a href="tel:0503225482" className="contact-button phone">
          <FaPhoneAlt size={18} /> חיוג: 050-3225482
        </a>
      </div>
    </div>,
    document.body
  );
};

export default ContactModal;

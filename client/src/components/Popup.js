import React from "react";
import "../styles/App.css";

const Popup = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h3>{title}</h3>
          <button className="popup-close" onClick={onClose}>✖</button>
        </div>
        <div className="popup-body">{children}</div>
      </div>
    </div>
  );
};

export default Popup;

import React from 'react';
import './Layout.css'; // We'll add the modal styles here

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null; // Don't render anything if the modal is closed
  }

  return (
    // The semi-transparent overlay
    <div className="modal-overlay" onClick={onClose}>
      
      {/* The modal panel itself. stopPropagation prevents clicks inside from closing it */}
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* The classic blue title bar */}
        {/* <div className="modal-title-bar">
          <span>System Alert</span>
          <button className="modal-close-button" onClick={onClose}>X</button>
        </div> */}
        
        {/* The content passed into the modal */}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
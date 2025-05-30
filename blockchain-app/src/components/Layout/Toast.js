import React, { useState, useEffect } from 'react';

const Toast = ({ message, type }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4500);  // Fade out slightly before removal from DOM
    
    return () => clearTimeout(timer);
  }, [message]);
  
  const getToastClass = () => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-danger';
      case 'warning':
        return 'bg-warning';
      default:
        return 'bg-info';
    }
  };
  
  return (
    <div 
      className={`position-fixed bottom-0 end-0 p-3 ${visible ? 'fade-in' : 'fade-out'}`} 
      style={{ zIndex: 1050 }}
    >
      <div className={`toast show ${getToastClass()} text-white`} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-body d-flex align-items-center">
          {type === 'success' && <i className="bi bi-check-circle-fill me-2"></i>}
          {type === 'error' && <i className="bi bi-exclamation-circle-fill me-2"></i>}
          {type === 'warning' && <i className="bi bi-exclamation-triangle-fill me-2"></i>}
          {type === 'info' && <i className="bi bi-info-circle-fill me-2"></i>}
          {message}
          <button 
            type="button" 
            className="btn-close btn-close-white ms-auto" 
            data-bs-dismiss="toast" 
            aria-label="Close"
            onClick={() => setVisible(false)}
          ></button>
        </div>
      </div>
      <style jsx="true">{`
        .fade-in {
          opacity: 1;
          transition: opacity 0.3s ease-in;
        }
        .fade-out {
          opacity: 0;
          transition: opacity 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Toast;
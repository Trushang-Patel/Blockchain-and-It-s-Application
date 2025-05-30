import React from 'react';

const Spinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';
  
  return (
    <div className="d-flex justify-content-center py-3">
      <div className={`spinner-border text-${color} ${sizeClass}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
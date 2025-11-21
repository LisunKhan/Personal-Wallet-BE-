import React from 'react';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'spinner-border-sm',
    medium: '',
    large: 'spinner-border-lg',
  };

  return (
    <div className={`d-flex align-items-center justify-content-center ${className}`}>
      <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
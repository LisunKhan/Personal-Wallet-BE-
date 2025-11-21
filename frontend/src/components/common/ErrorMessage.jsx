import React from 'react';

const ErrorMessage = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`d-flex flex-column align-items-center justify-content-center p-4 ${className}`}>
      <div className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-3" style={{width: '64px', height: '64px'}}>
        <svg width="32" height="32" className="text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="h5 fw-medium text-dark-override mb-2">Something went wrong</h3>
      <p className="text-muted text-center mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-primary"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
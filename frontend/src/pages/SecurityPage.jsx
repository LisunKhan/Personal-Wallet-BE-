import React, { useState } from 'react';

const SecurityPage = () => {
  const [securityData] = useState({
    weakPasswords: 3,
    reusedPasswords: 2,
    oldPasswords: 5,
    compromisedPasswords: 0,
    securityScore: 75,
  });

  return (
    <div className="min-vh-100 bg-light-override">
      <div className="gradient-bg-light min-vh-100 py-4">
        <div className="container-fluid">
          {/* Header */}
          <div className="row mb-4 fade-in">
            <div className="col-12">
              <h1 className="display-4 fw-bold text-dark-override mb-2">🛡️ Security Center</h1>
              <p className="lead text-muted">
                Monitor and improve your digital security
              </p>
            </div>
          </div>

          {/* Security Score */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card card-custom">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h2 className="h4 fw-bold text-dark-override mb-1">Security Score</h2>
                      <p className="text-muted mb-0">Overall health of your passwords</p>
                    </div>
                    <div className="text-end">
                      <div className="display-6 fw-bold text-primary">{securityData.securityScore}/100</div>
                      <div className="text-muted">Good</div>
                    </div>
                  </div>
                  <div className="progress" style={{height: '8px'}}>
                    <div 
                      className="progress-bar bg-primary" 
                      role="progressbar" 
                      style={{ width: `${securityData.securityScore}%` }}
                      aria-valuenow={securityData.securityScore} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Issues */}
          <div className="row g-4 mb-4">
            <div className="col-lg-3 col-md-6">
              <SecurityCard
                title="Weak Passwords"
                count={securityData.weakPasswords}
                color="danger"
                icon="⚠️"
                description="Passwords that are easy to guess"
              />
            </div>
            <div className="col-lg-3 col-md-6">
              <SecurityCard
                title="Reused Passwords"
                count={securityData.reusedPasswords}
                color="warning"
                icon="🔄"
                description="Same password used multiple times"
              />
            </div>
            <div className="col-lg-3 col-md-6">
              <SecurityCard
                title="Old Passwords"
                count={securityData.oldPasswords}
                color="info"
                icon="📅"
                description="Passwords older than 90 days"
              />
            </div>
            <div className="col-lg-3 col-md-6">
              <SecurityCard
                title="Compromised"
                count={securityData.compromisedPasswords}
                color="danger"
                icon="🚨"
                description="Found in known data breaches"
              />
            </div>
          </div>

          {/* Recommendations */}
          <div className="row">
            <div className="col-12">
              <div className="card card-custom">
                <div className="card-body">
                  <h2 className="h4 fw-bold text-dark-override mb-4">Security Recommendations</h2>
                  <div className="d-flex flex-column gap-3">
                    <RecommendationItem
                      priority="high"
                      title="Update weak passwords"
                      description="3 passwords are considered weak and should be updated immediately"
                      action="Review Passwords"
                    />
                    <RecommendationItem
                      priority="medium"
                      title="Enable two-factor authentication"
                      description="Add an extra layer of security to your important accounts"
                      action="Learn More"
                    />
                    <RecommendationItem
                      priority="low"
                      title="Regular security checkup"
                      description="Schedule monthly reviews of your password security"
                      action="Set Reminder"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SecurityCard = ({ title, count, color, icon, description }) => {
  return (
    <div className={`card border-${color} bg-${color} bg-opacity-10`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fs-2">{icon}</span>
          <span className="display-6 fw-bold text-dark-override">{count}</span>
        </div>
        <h3 className="h6 fw-bold text-dark-override mb-1">{title}</h3>
        <p className="text-muted small mb-0">{description}</p>
      </div>
    </div>
  );
};

const RecommendationItem = ({ priority, title, description, action }) => {
  const priorityColors = {
    high: 'bg-danger text-white',
    medium: 'bg-warning text-dark',
    low: 'bg-info text-white',
  };

  return (
    <div className="card bg-light">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className={`badge ${priorityColors[priority]} text-uppercase`}>
                {priority}
              </span>
              <h3 className="h6 fw-bold text-dark-override mb-0">{title}</h3>
            </div>
            <p className="text-muted mb-0">{description}</p>
          </div>
          <button className="btn btn-primary-custom btn-sm ms-3">
            {action}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
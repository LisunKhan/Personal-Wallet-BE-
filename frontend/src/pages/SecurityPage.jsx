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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Security Center</h1>
          <p className="text-gray-600 mt-2">
            Monitor and improve your digital security
          </p>
        </div>

        {/* Security Score */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Security Score</h2>
              <p className="text-gray-600">Overall health of your passwords</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{securityData.securityScore}/100</div>
              <div className="text-sm text-gray-500">Good</div>
            </div>
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${securityData.securityScore}%` }}
            ></div>
          </div>
        </div>

        {/* Security Issues */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SecurityCard
            title="Weak Passwords"
            count={securityData.weakPasswords}
            color="red"
            icon="⚠️"
            description="Passwords that are easy to guess"
          />
          <SecurityCard
            title="Reused Passwords"
            count={securityData.reusedPasswords}
            color="orange"
            icon="🔄"
            description="Same password used multiple times"
          />
          <SecurityCard
            title="Old Passwords"
            count={securityData.oldPasswords}
            color="yellow"
            icon="📅"
            description="Passwords older than 90 days"
          />
          <SecurityCard
            title="Compromised"
            count={securityData.compromisedPasswords}
            color="red"
            icon="🚨"
            description="Found in known data breaches"
          />
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Recommendations</h2>
          <div className="space-y-4">
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
  );
};

const SecurityCard = ({ title, count, color, icon, description }) => {
  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    green: 'bg-green-50 border-green-200 text-green-800',
  };

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-2xl font-bold">{count}</span>
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  );
};

const RecommendationItem = ({ priority, title, description, action }) => {
  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority]}`}>
            {priority.toUpperCase()}
          </span>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
        {action}
      </button>
    </div>
  );
};

export default SecurityPage;
import React from 'react';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Digital Vault
          </h1>
          <p className="text-gray-600">
            Securely manage your passwords, documents, and sensitive information
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600">Dashboard is loading... Backend connection needed for full functionality.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
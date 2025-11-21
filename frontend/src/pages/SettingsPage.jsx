import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'data', label: 'Data', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account and application preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="mr-3">{tab.icon}</span>
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {activeTab === 'account' && <AccountSettings user={user} />}
              {activeTab === 'security' && <SecuritySettings />}
              {activeTab === 'preferences' && <PreferencesSettings />}
              {activeTab === 'data' && <DataSettings />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountSettings = ({ user }) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h2>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          value={user?.email || ''}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
        />
        <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Account Created</label>
        <input
          type="text"
          value="Recently"
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Delete Account
        </button>
        <p className="text-sm text-gray-500 mt-2">
          This action cannot be undone. All your data will be permanently deleted.
        </p>
      </div>
    </div>
  </div>
);

const SecuritySettings = () => (
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Master Password</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Change Master Password
        </button>
        <p className="text-sm text-gray-500 mt-2">
          Your master password is used to encrypt all your data
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">2FA Status</p>
            <p className="text-sm text-gray-500">Not enabled</p>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Enable 2FA
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Session Management</h3>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Log Out All Devices
        </button>
        <p className="text-sm text-gray-500 mt-2">
          This will log you out of all devices and browsers
        </p>
      </div>
    </div>
  </div>
);

const PreferencesSettings = () => (
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>Light</option>
          <option>Dark</option>
          <option>System</option>
        </select>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Auto-lock</h3>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>Never</option>
          <option>5 minutes</option>
          <option>15 minutes</option>
          <option>1 hour</option>
        </select>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
            <span className="ml-2 text-gray-700">Security alerts</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-gray-700">Password expiry reminders</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

const DataSettings = () => (
  <div>
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Management</h2>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Export Data</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Export Vault
        </button>
        <p className="text-sm text-gray-500 mt-2">
          Download all your vault data in encrypted format
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Import Data</h3>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Import from File
        </button>
        <p className="text-sm text-gray-500 mt-2">
          Import passwords from other password managers
        </p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Storage Usage</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Vault Items</span>
            <span className="font-medium">0 items</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Storage Used</span>
            <span className="font-medium">0 KB</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsPage;
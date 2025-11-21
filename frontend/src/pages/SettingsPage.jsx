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
    <div className="min-vh-100 bg-light-override">
      <div className="gradient-bg-light min-vh-100 py-4">
        <div className="container-fluid">
          {/* Header */}
          <div className="row mb-4 fade-in">
            <div className="col-12">
              <h1 className="display-4 fw-bold text-dark-override mb-2">⚙️ Settings</h1>
              <p className="lead text-muted">
                Manage your account and application preferences
              </p>
            </div>
          </div>

          <div className="row g-4">
            {/* Sidebar */}
            <div className="col-lg-3 col-md-4">
              <div className="card card-custom">
                <div className="card-body p-3">
                  <nav>
                    <ul className="nav nav-pills flex-column">
                      {tabs.map((tab) => (
                        <li key={tab.id} className="nav-item mb-1">
                          <button
                            onClick={() => setActiveTab(tab.id)}
                            className={`nav-link w-100 text-start d-flex align-items-center ${activeTab === tab.id
                                ? 'active'
                                : 'text-dark-override'
                              }`}
                          >
                            <span className="me-3 fs-5">{tab.icon}</span>
                            <span className="fw-medium">{tab.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="col-lg-9 col-md-8">
              <div className="card card-custom">
                <div className="card-body">
                  {activeTab === 'account' && <AccountSettings user={user} />}
                  {activeTab === 'security' && <SecuritySettings />}
                  {activeTab === 'preferences' && <PreferencesSettings />}
                  {activeTab === 'data' && <DataSettings />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountSettings = ({ user }) => (
  <div>
    <h2 className="h3 fw-bold text-dark-override mb-4">👤 Account Information</h2>
    <div className="row g-4">
      <div className="col-12">
        <label className="form-label fw-semibold text-dark-override">Email Address</label>
        <input
          type="email"
          value={user?.email || ''}
          disabled
          className="form-control form-control-custom bg-light"
        />
        <div className="form-text">Email cannot be changed</div>
      </div>

      <div className="col-12">
        <label className="form-label fw-semibold text-dark-override">Account Created</label>
        <input
          type="text"
          value="Recently"
          disabled
          className="form-control form-control-custom bg-light"
        />
      </div>

      <div className="col-12">
        <hr className="my-4" />
        <h3 className="h5 fw-bold text-danger mb-3">⚠️ Danger Zone</h3>
        <button className="btn btn-danger">
          Delete Account
        </button>
        <div className="form-text text-danger mt-2">
          This action cannot be undone. All your data will be permanently deleted.
        </div>
      </div>
    </div>
  </div>
);

const SecuritySettings = () => (
  <div>
    <h2 className="h3 fw-bold text-dark-override mb-4">🔒 Security Settings</h2>
    <div className="row g-4">
      <div className="col-12">
        <h3 className="h5 fw-bold text-dark-override mb-3">Master Password</h3>
        <button className="btn btn-primary-custom">
          Change Master Password
        </button>
        <div className="form-text mt-2">
          Your master password is used to encrypt all your data
        </div>
      </div>

      <div className="col-12">
        <h3 className="h5 fw-bold text-dark-override mb-3">Two-Factor Authentication</h3>
        <div className="card bg-light">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <p className="fw-medium text-dark-override mb-1">2FA Status</p>
              <p className="text-muted mb-0">Not enabled</p>
            </div>
            <button className="btn btn-success">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>

      <div className="col-12">
        <h3 className="h5 fw-bold text-dark-override mb-3">Session Management</h3>
        <button className="btn btn-danger">
          Log Out All Devices
        </button>
        <div className="form-text mt-2">
          This will log you out of all devices and browsers
        </div>
      </div>
    </div>
  </div>
);

const PreferencesSettings = () => (
  <div>
    <h2 className="h3 fw-bold text-dark-override mb-4">⚙️ Preferences</h2>
    <div className="row g-4">
      <div className="col-md-6">
        <h3 className="h5 fw-bold text-dark-override mb-3">Theme</h3>
        <select className="form-select form-control-custom">
          <option>Light</option>
          <option>Dark</option>
          <option>System</option>
        </select>
      </div>

      <div className="col-md-6">
        <h3 className="h5 fw-bold text-dark-override mb-3">Auto-lock</h3>
        <select className="form-select form-control-custom">
          <option>Never</option>
          <option>5 minutes</option>
          <option>15 minutes</option>
          <option>1 hour</option>
        </select>
      </div>

      <div className="col-12">
        <h3 className="h5 fw-bold text-dark-override mb-3">Notifications</h3>
        <div className="d-flex flex-column gap-3">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="securityAlerts" defaultChecked />
            <label className="form-check-label text-dark-override" htmlFor="securityAlerts">
              Security alerts
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="passwordReminders" />
            <label className="form-check-label text-dark-override" htmlFor="passwordReminders">
              Password expiry reminders
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DataSettings = () => (
  <div>
    <h2 className="h3 fw-bold text-dark-override mb-4">📊 Data Management</h2>
    <div className="row g-4">
      <div className="col-md-6">
        <h3 className="h5 fw-bold text-dark-override mb-3">Export Data</h3>
        <button className="btn btn-primary-custom">
          Export Vault
        </button>
        <div className="form-text mt-2">
          Download all your vault data in encrypted format
        </div>
      </div>

      <div className="col-md-6">
        <h3 className="h5 fw-bold text-dark-override mb-3">Import Data</h3>
        <button className="btn btn-success">
          Import from File
        </button>
        <div className="form-text mt-2">
          Import passwords from other password managers
        </div>
      </div>

      <div className="col-12">
        <h3 className="h5 fw-bold text-dark-override mb-3">Storage Usage</h3>
        <div className="card bg-light">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-dark-override">Vault Items</span>
              <span className="fw-bold text-dark-override">0 items</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-dark-override">Storage Used</span>
              <span className="fw-bold text-dark-override">0 KB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SettingsPage;
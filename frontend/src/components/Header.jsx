import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg gradient-bg shadow-lg">
      <div className="container-fluid">
        {/* Brand */}
        <Link
          to={isAuthenticated ? "/vault" : "/"}
          className="navbar-brand text-white fw-bold fs-3 text-decoration-none"
        >
          <span className="me-2">🔐</span>
          Digital Wallet
        </Link>

        {/* Mobile menu button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <svg className="text-white" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Navigation */}
        <div className={`navbar-collapse ${isMenuOpen ? 'd-block' : 'd-none d-lg-block'}`} id="navbarNav">
          {isAuthenticated ? (
            <>
              {/* Main Navigation - Always visible on desktop */}
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    to="/vault"
                    className={`nav-link fw-medium px-3 py-2 rounded-pill mx-1 ${isActiveRoute('/vault')
                      ? 'nav-link-active'
                      : 'nav-link-inactive'
                      }`}
                  >
                    <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    🔐 Vault
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/security"
                    className={`nav-link fw-medium px-3 py-2 rounded-pill mx-1 ${isActiveRoute('/security')
                      ? 'nav-link-active'
                      : 'nav-link-inactive'
                      }`}
                  >
                    <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    🛡️ Security
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/settings"
                    className={`nav-link fw-medium px-3 py-2 rounded-pill mx-1 ${isActiveRoute('/settings')
                      ? 'nav-link-active'
                      : 'nav-link-inactive'
                      }`}
                  >
                    <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    ⚙️ Settings
                  </Link>
                </li>
              </ul>

              {/* User Menu & Actions */}
              <div className="d-flex align-items-center gap-3">
                {/* User Profile Card */}
                <div className="dropdown">
                  <button
                    className="btn btn-link text-decoration-none p-0 d-flex align-items-center user-profile-btn"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="d-flex align-items-center bg-white bg-opacity-10 rounded-pill user-profile-card-large">
                      {/* Avatar */}
                      <div className="user-avatar-container-large rounded-circle me-3">
                        <svg width="24" height="24" fill="currentColor" className="user-avatar-icon" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                      
                      {/* User Info */}
                      <div className="text-start flex-grow-1 me-3 d-none d-lg-block">
                        <div className="text-white fw-bold user-name-large">
                          {(user?.email || user?.username || 'User').split('@')[0]}
                        </div>
                        <div className="text-white-50 user-role-large">
                          {user?.email ? 'Premium Account' : 'User Account'}
                        </div>
                      </div>
                      
                      {/* User Info - Medium screens */}
                      <div className="text-start flex-grow-1 me-3 d-none d-md-block d-lg-none">
                        <div className="text-white fw-bold" style={{fontSize: '1rem'}}>
                          {(user?.email || user?.username || 'User').split('@')[0]}
                        </div>
                      </div>
                      
                      {/* Status Indicator */}
                      <div className="d-flex align-items-center me-2">
                        <div className="bg-success rounded-circle status-dot me-2"></div>
                        <svg width="16" height="16" fill="none" stroke="currentColor" className="text-white dropdown-arrow" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  
                  {/* Enhanced Dropdown Menu */}
                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 user-dropdown">
                    <li>
                      <div className="dropdown-header bg-light rounded-top">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <svg width="20" height="20" fill="currentColor" className="text-primary" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{(user?.email || user?.username || 'User').split('@')[0]}</div>
                            <small className="text-muted">{user?.email || 'user@example.com'}</small>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li><hr className="dropdown-divider my-1" /></li>
                    
                    {/* Quick Actions */}
                    <li>
                      <h6 className="dropdown-header text-muted fw-bold" style={{fontSize: '0.75rem'}}>
                        QUICK ACCESS
                      </h6>
                    </li>
                    <li>
                      <Link to="/vault" className="dropdown-item py-2">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded p-1 me-3">
                            <svg width="16" height="16" fill="none" stroke="currentColor" className="text-primary" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <div>
                            <div className="fw-medium">Vault</div>
                            <small className="text-muted">Manage passwords</small>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/security" className="dropdown-item py-2">
                        <div className="d-flex align-items-center">
                          <div className="bg-success bg-opacity-10 rounded p-1 me-3">
                            <svg width="16" height="16" fill="none" stroke="currentColor" className="text-success" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <div>
                            <div className="fw-medium">Security</div>
                            <small className="text-muted">Security center</small>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings" className="dropdown-item py-2">
                        <div className="d-flex align-items-center">
                          <div className="bg-info bg-opacity-10 rounded p-1 me-3">
                            <svg width="16" height="16" fill="none" stroke="currentColor" className="text-info" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="fw-medium">Settings</div>
                            <small className="text-muted">Account settings</small>
                          </div>
                        </div>
                      </Link>
                    </li>
                    
                    <li><hr className="dropdown-divider my-1" /></li>
                    
                    {/* Account Actions */}
                    <li>
                      <Link to="/profile" className="dropdown-item py-2">
                        <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile Settings
                      </Link>
                    </li>
                    
                    <li><hr className="dropdown-divider my-1" /></li>
                    
                    <li>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item text-danger py-2 fw-medium"
                      >
                        <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Quick Logout Button (Mobile) */}
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light btn-sm d-md-none"
                  title="Logout"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Guest Navigation */}
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="nav-link text-white fw-medium px-3 py-2 rounded-pill mx-1 hover:bg-white hover:bg-opacity-10 transition-all"
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/signup"
                    className="btn btn-light fw-medium px-4 py-2 rounded-pill mx-1"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;

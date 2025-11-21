import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/vault" : "/"} className="text-2xl font-bold">
              🔐 Digital Wallet
            </Link>
          </div>

          <nav className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/vault" className="hover:text-blue-200 transition-colors">
                  Vault
                </Link>
                <Link to="/security" className="hover:text-blue-200 transition-colors">
                  Security
                </Link>
                <Link to="/settings" className="hover:text-blue-200 transition-colors">
                  Settings
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-sm">Welcome, {user?.username || 'User'}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition-colors">
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

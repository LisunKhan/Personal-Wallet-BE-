import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white py-6">
      <h1 className="text-3xl font-bold text-center">Digital Wallet</h1>
      <nav className="flex justify-center mt-4">
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link to="/login" className="text-white">Login</Link>
          <Link to="/signup" className="text-white">Signup</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;

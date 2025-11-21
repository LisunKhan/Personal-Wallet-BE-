import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { hashMasterPassword } from '../utils/crypto';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const hashedPassword = await hashMasterPassword(password, email);

      await login({
        email: email,
        master_key_hash: hashedPassword,
      });

      setMessage('Login successful! Redirecting...');
      // The useAuth hook will handle the redirect automatically
      setTimeout(() => {
        navigate('/vault');
      }, 1000);
    } catch (error) {
      setMessage(`Login failed: ${error.response?.data?.detail || error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Welcome Back!</h2>
        <p className="text-center text-gray-600">Sign in to continue to your Digital Wallet</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-gray-600" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600" htmlFor="password">Master Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {message && <p className={`mt-4 text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        <p className="text-sm text-center text-gray-600">
          Don't have an account? <Link to="/signup" className="font-semibold text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

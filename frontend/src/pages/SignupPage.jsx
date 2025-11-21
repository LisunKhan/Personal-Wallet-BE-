import React, { useState } from 'react';
import API from '../services/api';
import { hashMasterPassword } from '../utils/crypto';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const hashedPassword = await hashMasterPassword(password, email);

      await API.post('/accounts/signup/', {
        email: email,
        master_key_hash: hashedPassword,
      });

      setMessage('Signup successful! You can now log in.');
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage(`Signup failed: ${error.response?.data?.detail || error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Create Your Account</h2>
        <p className="text-center text-gray-600">Get started with your secure Digital Wallet</p>
        <form onSubmit={handleSignup} className="space-y-6">
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
            className="w-full py-3 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? 'Signing up...' : 'Create Account'}
          </button>
        </form>
        {message && <p className={`mt-4 text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        <p className="text-sm text-center text-gray-600">
          Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

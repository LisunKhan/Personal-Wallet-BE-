import React, { useState } from 'react';
import argon2 from 'argon2-browser';
import API from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const hashedPassword = await argon2.hash({
        pass: password,
        salt: salt,
        time: 1,
        mem: 1024,
        hashLen: 32,
        parallelism: 1,
        type: argon2.Argon2id,
      });

      const response = await API.post('/accounts/login/', {
        email: email,
        master_key_hash: hashedPassword.hex,
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setMessage('Login successful!');
    } catch (error) {
      setMessage('Login failed.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Master Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;

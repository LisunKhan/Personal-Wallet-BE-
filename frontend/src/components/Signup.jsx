import React, { useState } from 'react';
import argon2 from 'argon2-browser';
import API from '../services/api';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
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

      await API.post('/accounts/signup/', {
        email: email,
        master_key_hash: hashedPassword.hex,
      });

      setMessage('Signup successful!');
    } catch (error) {
      setMessage('Signup failed.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
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
        <button type="submit">Signup</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;

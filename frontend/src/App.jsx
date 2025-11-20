import React from 'react';
import Signup from './components/Signup';
import Login from './components/Login';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-6">
        <h1 className="text-3xl font-bold text-center">Digital Wallet</h1>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Signup />
          <Login />
        </div>
      </main>
    </div>
  );
}

export default App;

import React from 'react';
import Signup from './components/Signup';
import Login from './components/Login';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Digital Wallet</h1>
      </header>
      <main>
        <Signup />
        <hr />
        <Login />
      </main>
    </div>
  );
}

export default App;

import React from 'react';
import './App.css';
import ChatRoom from './components/ChatRoom';
import NavBar from './components/NavBar';
import Home from "./components/Home"
import StockClient from './components/StockClient';

function App() {
  return (
    <>
      <NavBar />
      <div className="home">
        <Home />
      </div>
    </>
  );
}

export default App;

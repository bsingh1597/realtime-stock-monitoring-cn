import React from 'react';
import './App.css';
import NavBar from './components/NavBar';
import Home from "./components/Home"
import StockClient from './components/StockClient';

function App() {
  return (
    <div className="App">
      <NavBar/>
      <div className="home">
        <Home/>
      </div>
    </div>
  );
}

export default App;

import React from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';
import NavBar from './components/NavBar';
import Home from "./components/Home"
import Login from './components/Login';
import SignUp from "./components/SignUp"
function App() {
  return (
    <>
      <NavBar />
      {/* <div className="home">
        <Home />
      </div> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;

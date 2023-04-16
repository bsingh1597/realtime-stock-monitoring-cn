import React from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';
import NavBar from './components/NavBar';
import Home from "./components/Home"
import Login from './components/Login';
import SignUp from "./components/SignUp"
import PostSignUp from "./components/PostSignUp";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/postSignUp' element={<PostSignUp />} />
      </Routes>
    </>
  );
}

export default App;

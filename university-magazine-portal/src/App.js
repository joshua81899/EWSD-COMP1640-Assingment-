import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Placeholder routes for future pages */}
        <Route path="/login" element={<div className="p-10 text-center">Login Page (Coming Soon)</div>} />
        <Route path="/register" element={<div className="p-10 text-center">Register Page (Coming Soon)</div>} />
        <Route path="/terms" element={<div className="p-10 text-center">Terms & Conditions (Coming Soon)</div>} />
        <Route path="/help" element={<div className="p-10 text-center">Help Page (Coming Soon)</div>} />
      </Routes>
    </Router>
  );
}


export default App;


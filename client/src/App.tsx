import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Exercise1 from './pages/Exercise1';
import Exercise2 from './pages/Exercise2';
import Exercise3 from './pages/Exercise3';
import Exercise4 from './pages/Exercise4';
import Exercise5 from './pages/Exercise5';
import Exercise6 from './pages/Exercise6';
import Exercise7 from './pages/Exercise7';
import Exercise8 from './pages/Exercise8';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercise1" element={<Exercise1 />} />
          <Route path="/exercise2" element={<Exercise2 />} />
          <Route path="/exercise3" element={<Exercise3 />} />
          <Route path="/exercise4" element={<Exercise4 />} />
          <Route path="/exercise5" element={<Exercise5 />} />
          <Route path="/exercise6" element={<Exercise6 />} />
          <Route path="/exercise7" element={<Exercise7 />} />
          <Route path="/exercise8" element={<Exercise8 />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
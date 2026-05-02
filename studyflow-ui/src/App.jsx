import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import StudySession from './pages/StudySession';
import Simulado from './pages/Simulado';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/estudar" element={<StudySession />} />
          <Route path="/simulado" element={<Simulado />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import StudySession from './pages/StudySession';
import Simulado from './pages/Simulado';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          
          <main className="max-w-5xl mx-auto py-8 px-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/estudar" element={<StudySession />} />
              <Route path="/simulado" element={<Simulado />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App;

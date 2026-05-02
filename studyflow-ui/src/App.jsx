import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import StudySession from './pages/StudySession';
import Simulado from './pages/Simulado';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors font-sans text-slate-800 dark:text-slate-100">
          <Toaster 
            position="top-center" 
            toastOptions={{ 
              className: 'dark:bg-slate-800 dark:text-white',
              duration: 3000
            }} 
          />
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          
          <main className="max-w-6xl mx-auto">
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

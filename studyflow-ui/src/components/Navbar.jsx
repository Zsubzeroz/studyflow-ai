import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BrainCircuit, Moon, Sun } from 'lucide-react';

const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-white/20 dark:border-slate-800 p-4 sticky top-0 z-50 transition-colors shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-1.5 rounded-xl text-white shadow-lg shadow-indigo-500/30">
            <BrainCircuit size={24}/>
          </div>
          StudyFlow
        </Link>
        
        <div className="flex items-center gap-8 font-medium">
          <Link to="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <LayoutDashboard size={18}/> <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link to="/estudar" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <BookOpen size={18}/> <span className="hidden sm:inline">Revisar</span>
          </Link>
          <Link to="/simulado" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <BrainCircuit size={18}/> <span className="hidden sm:inline">Simulado</span>
          </Link>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-110 active:scale-95"
          >
            {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, BrainCircuit, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ darkMode, setDarkMode }) => {
  const location = useLocation();

  const navLinks = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/estudar', icon: BookOpen, label: 'Revisar' },
    { path: '/simulado', icon: BrainCircuit, label: 'Simulado' },
  ];

  return (
    <nav className="glass sticky top-0 z-50 transition-colors shadow-lg shadow-indigo-500/5">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-2xl font-black text-gradient flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/40"
          >
            <BrainCircuit size={24}/>
          </motion.div>
          <span className="hidden xs:inline">StudyFlow</span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-6 font-medium">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path}
                to={link.path} 
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? "text-indigo-600 dark:text-indigo-400" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100"
                }`}
              >
                <link.icon size={18}/>
                <span className="hidden md:inline">{link.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute -bottom-4 left-0 right-0 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-t-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2 hidden xs:block"></div>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-110 active:scale-95 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


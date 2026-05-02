import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-200" />
            <span className="font-bold text-2xl tracking-tight">StudyFlow AI</span>
          </Link>
          <div className="flex items-center space-x-4 font-semibold">
            <Link to="/estudar" className="hover:text-blue-200 transition-colors">
              Estudar
            </Link>
            <Link to="/simulado" className="hover:text-blue-200 transition-colors">
              Simulado
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

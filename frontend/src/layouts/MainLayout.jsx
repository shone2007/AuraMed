import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <HeartPulse className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl text-secondary">AuraMed</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium">Home</Link>
              <Link to="/about" className="text-slate-600 hover:text-primary px-3 py-2 text-sm font-medium">About</Link>
              <Link to="/login" className="bg-primary text-white hover:bg-blue-800 px-4 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>

      <footer className="bg-secondary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} AuraMed Hospital Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

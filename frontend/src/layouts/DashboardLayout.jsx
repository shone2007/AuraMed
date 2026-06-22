import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { HeartPulse, LayoutDashboard, Users, CalendarDays, Receipt, LogOut, Menu, X, Stethoscope } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: `/${user?.role?.toLowerCase()}/dashboard`, icon: LayoutDashboard },
  ];

  if (user?.role === 'Admin') {
    navItems.push(
      { name: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
      { name: 'Patients', path: '/admin/patients', icon: Users },
      { name: 'Appointments', path: '/admin/appointments', icon: CalendarDays },
      { name: 'Staff Management', path: '/admin/staff', icon: Users },
      { name: 'Billing', path: '/admin/bills', icon: Receipt }
    );
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-secondary text-white flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700">
          <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <HeartPulse className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">AuraMed</span>
          </Link>
          <button className="lg:hidden text-slate-300 hover:text-white" onClick={closeMobileMenu}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6 px-2">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Menu</p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors text-sm font-medium"
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-slate-300 hover:bg-red-900/50 hover:text-red-400 rounded-md transition-colors text-sm font-medium"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 truncate">
              {user?.role} Portal
            </h2>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate max-w-[150px]">{user?.email}</p>
            </div>
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary rounded-full flex items-center justify-center text-white font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
          <div className="max-w-7xl mx-auto h-full">
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

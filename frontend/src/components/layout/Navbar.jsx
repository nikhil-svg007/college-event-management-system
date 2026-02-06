import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link 
          to="/" 
          className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent hover:from-primary-300 hover:to-primary-500 transition-all duration-200"
        >
          College Events
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link 
            to="/events" 
            className="text-slate-300 hover:text-primary-400 font-medium transition-colors duration-200"
          >
            Events
          </Link>
          {user && user.role === 'student' && (
            <Link 
              to="/my-events" 
              className="text-slate-300 hover:text-primary-400 font-medium transition-colors duration-200"
            >
              My Events
            </Link>
          )}
          {user && user.role === 'society_admin' && (
            <Link 
              to="/admin/events" 
              className="text-slate-300 hover:text-primary-400 font-medium transition-colors duration-200"
            >
              Dashboard
            </Link>
          )}
          {!user && (
            <>
              <Link 
                to="/login" 
                className="text-slate-300 hover:text-primary-400 font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="btn-primary text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
          {user && (
            <>
              <div className="hidden items-center gap-3 sm:flex">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-medium text-slate-200">{user.name}</span>
                  <span className="text-xs text-slate-400 capitalize">{user.role.replace('_', ' ')}</span>
                </div>
                <div className="h-8 w-px bg-slate-700"></div>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


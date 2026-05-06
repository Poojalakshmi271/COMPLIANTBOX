import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogOut, LayoutDashboard, PlusCircle, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar glass">
      <div className="nav-container container">
        <Link to="/" className="nav-link" style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          <ShieldAlert className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
          Smart Complaint Box
        </Link>
        
        <div className="nav-links">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>
                  <LayoutDashboard className="w-4 h-4" /> Admin Panel
                </Link>
              ) : (
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              )}
              <Link to="/submit" className={`nav-link ${isActive('/submit')}`}>
                <PlusCircle className="w-4 h-4" /> New Complaint
              </Link>
              <div className="nav-link" style={{ cursor: 'pointer' }} onClick={handleLogout}>
                <LogOut className="w-4 h-4" /> Logout
              </div>
              <div className="nav-link" style={{ marginLeft: '1rem', background: 'rgba(236, 72, 153, 0.1)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-xl)' }}>
                <UserIcon className="w-4 h-4" />
                <span style={{ fontSize: '0.85rem' }}>{user.name} ({user.role})</span>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

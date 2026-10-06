import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          HopeShare<span>Platform</span>
        </Link>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>

        {/* Navigation Menu */}
        <nav className={`navbar-nav ${isOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>
            Explore
          </Link>

          {user ? (
            <>
              <Link to="/my-donations" className="nav-link" onClick={closeMenu}>
                My Donations
              </Link>
              {isAdmin && (
                <Link to="/admin/dashboard" className="nav-link nav-link-admin" onClick={closeMenu}>
                  Admin Panel
                </Link>
              )}

              {/* Profile Link with Avatar */}
              <Link to="/profile" className="nav-profile" onClick={closeMenu}>
                <img
                  src={user.profileImageUrl || '/default-avatar.png'}
                  alt={`${user.firstName}'s avatar`}
                  className="nav-avatar"
                />
                <span className="nav-username">{user.firstName}</span>
                <span className="nav-role">({user.role})</span>
              </Link>

              <button onClick={handleLogout} className="btn btn-outline nav-btn">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline nav-btn" onClick={closeMenu}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary nav-btn" onClick={closeMenu}>
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
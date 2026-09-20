import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
        <Link to="/" style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
          HopeShare<span style={{ color: 'var(--text-main)' }}>Platform</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/" style={{ fontWeight: 500 }}>Explore</Link>
          
          {user ? (
            <>
              <Link to="/my-donations" style={{ fontWeight: 500 }}>My Donations</Link>
              {isAdmin && (
                <Link to="/admin/dashboard" style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  Admin Panel
                </Link>
              )}
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {user.name} ({user.role})
              </span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>Sign In</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }}>Get Started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
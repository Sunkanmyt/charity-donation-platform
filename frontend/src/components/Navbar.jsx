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

              {/* Profile Link with Avatar */}
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                }}
              >
                <img
                  src={
                    user.profileImageUrl || "/default-avatar.png"
                  }
                  alt={`${user.firstName}'s avatar`}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid var(--border)',
                  }}
                />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>
                  {user.firstName}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ({user.role})
                </span>
              </Link>

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
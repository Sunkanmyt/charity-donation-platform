import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function VerifyEmail() {
  const { user } = useAuth();
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    if (hasRequestedRef.current) return;  
    hasRequestedRef.current = true;

    const performVerification = async () => {
      try {
        const res = await api.get(`/users/verify/${token}`);
        setStatus('success');
        setMessage(res.message || 'Your email has been verified!');
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Verification failed or link expired.');
      }
    };

    performVerification();
    }, [token]);

  return (
    <div className="container" style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        {status === 'verifying' && (
          <div>
            <h2 style={{ marginBottom: '1rem' }}>Verifying your account...</h2>
            <p style={{ color: 'var(--text-muted)' }}>Please wait while we confirm your email address.</p>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <div style={{ fontSize: '3rem', color: '#16a34a', marginBottom: '1rem' }}>✓</div>
            <h2 style={{ marginBottom: '0.75rem' }}>Email Verified!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{message}</p>
            
            {user ? (
              <Link to="/" className="btn btn-primary" style={{ display: 'inline-block', width: '100%' }}>
                Continue to Platform
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{ display: 'inline-block', width: '100%' }}>
                Proceed to Login
              </Link>
            )}
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{ fontSize: '3rem', color: '#dc2626', marginBottom: '1rem' }}>✕</div>
            <h2 style={{ marginBottom: '0.75rem' }}>Verification Failed</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{message}</p>
            <Link to="/register" className="btn btn-outline" style={{ display: 'inline-block', width: '100%' }}>
              Back to Registration
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
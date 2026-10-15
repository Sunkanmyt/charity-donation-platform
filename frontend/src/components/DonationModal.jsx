import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ErrorBanner from './ErrorBanner';

export default function DonationModal({ campaignId, campaignTitle, onClose, onSuccess }) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isVerified = Boolean(user?.isVerified);

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      setError('Please verify your email address before making a donation.');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid donation amount.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/donations', {
        campaignId,
        amount: Number(amount),
        isAnonymous,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3 style={{ marginBottom: '0.5rem' }}>Donate to Campaign</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          {campaignTitle}
        </p>

        <ErrorBanner message={error} onClose={() => setError('')} />

        {/* Verification Warning Notice */}
        {!isVerified && (
          <div
            style={{
              background: '#fffbeb',
              border: '1px solid #fef3c7',
              color: '#92400e',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              lineHeight: 1.4,
            }}
          >
            <strong>Email Verification Required:</strong> You must verify your email address to make donations. Check your inbox for the confirmation link or visit your Account Settings.
          </div>
        )}

        <form onSubmit={handleDonate}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              Select Quick Amount:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {[10, 25, 50, 100].map((val) => (
                <button
                  type="button"
                  key={val}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '0.4rem' }}
                  onClick={() => setAmount(val)}
                  disabled={!isVerified}
                >
                  ₦{val}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              step="any"
              placeholder="Or enter custom amount (₦)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={!isVerified}
              style={{
                width: '100%',
                padding: '0.6rem',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                background: !isVerified ? '#f1f5f9' : 'var(--surface)',
                cursor: !isVerified ? 'not-allowed' : 'text',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input
              type="checkbox"
              id="anon"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              disabled={!isVerified}
            />
            <label htmlFor="anon" style={{ fontSize: '0.9rem', color: !isVerified ? 'var(--text-muted)' : 'inherit' }}>
              Donate anonymously
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !isVerified}
              style={{
                flex: 1,
                opacity: (!isVerified || loading) ? 0.6 : 1,
                cursor: !isVerified ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Processing...' : 'Confirm Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
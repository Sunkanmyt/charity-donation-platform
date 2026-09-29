import { useState } from 'react';
import api from '../services/api';
import ErrorBanner from './ErrorBanner';

export default function DonationModal({ campaignId, campaignTitle, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDonate = async (e) => {
    e.preventDefault();
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
        anonymous
      });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Payment simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3 style={{ marginBottom: '0.5rem' }}>Donate to Campaign</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{campaignTitle}</p>

        <ErrorBanner message={error} onClose={() => setError('')} />

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
                >
                  ${val}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="1"
              step="any"
              placeholder="Or enter custom amount ($)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '6px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input
              type="checkbox"
              id="anon"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
            <label htmlFor="anon" style={{ fontSize: '0.9rem' }}>Donate anonymously</label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Processing...' : 'Confirm Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
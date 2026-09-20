import { useState, useEffect } from 'react';
import api from '../services/api';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';

export default function UserDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyDonations = async () => {
      try {
        const res = await api.get('/donations/my');
        setDonations(res.data || []);
      } catch (err) {
        setError(err.message || 'Unable to retrieve donation history.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyDonations();
  }, []);

  const totalGiven = donations.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="container">
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>My Giving History</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>View all contributions linked to your profile.</p>

      <ErrorBanner message={error} onClose={() => setError('')} />

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'inline-block', minWidth: '240px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Impact</span>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
          ${totalGiven.toLocaleString()}
        </div>
      </div>

      {loading ? (
        <p>Loading donation records...</p>
      ) : donations.length === 0 ? (
        <EmptyState title="No donations recorded" description="Explore active campaigns and make your first simulated contribution." />
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem' }}>Campaign</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Visibility</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{d.campaign?.title || 'Unknown Campaign'}</td>
                  <td style={{ padding: '1rem' }}>${d.amount.toLocaleString()}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge" style={{ background: d.anonymous ? '#fee2e2' : '#e0e7ff', color: d.anonymous ? '#991b1b' : '#3730a3' }}>
                      {d.anonymous ? 'Anonymous' : 'Public'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
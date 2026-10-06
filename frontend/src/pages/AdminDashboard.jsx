import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ErrorBanner from '../components/ErrorBanner';

export default function AdminDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete modal state
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const res = await api.get('/campaigns?limit=50');
      const data = res?.data?.data || res?.data || {};
      setCampaigns(data.campaigns || (Array.isArray(data) ? data : []));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error loading administrative records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const confirmDelete = async () => {
    if (!campaignToDelete) return;
    setDeleting(true);

    try {
      await api.delete(`/campaigns/${campaignToDelete._id}`);
      // Remove from the dashboard list immediately
      setCampaigns((prev) => prev.filter((c) => c._id !== campaignToDelete._id));
      setCampaignToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to archive campaign.');
    } finally {
      setDeleting(false);
    }
  };

  const totalFunds = campaigns.reduce((acc, c) => acc + (c.raisedAmount || 0), 0);
  const activeCount = campaigns.filter((c) => c.status === 'active').length;

  return (
    <div className="container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem' }}>Admin Control Center</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Manage platform campaigns and verify fundraising activity.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/admin/users" className="btn btn-outline">
            Manage Users
          </Link>
          <Link to="/admin/campaigns/new" className="btn btn-primary">
            + Create New Campaign
          </Link>
        </div>
      </div>

      <ErrorBanner message={error} onClose={() => setError('')} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            TOTAL FUNDS RAISED
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>
            ₦{totalFunds.toLocaleString()}
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            ACTIVE CAMPAIGNS
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>
            {activeCount}
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            TOTAL CAMPAIGNS
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>
            {campaigns.length}
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading records...</p>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem' }}>Title</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Target</th>
                <th style={{ padding: '1rem' }}>Raised</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{c.title}</td>
                  <td style={{ padding: '1rem' }}>{c.category}</td>
                  <td style={{ padding: '1rem' }}>₦{c.targetAmount?.toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>₦{c.raisedAmount?.toLocaleString() || 0}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge badge-${c.status}`}>{c.status}</span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Link
                        to={`/admin/campaigns/${c._id}/edit`}
                        className="btn btn-outline"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', textDecoration: 'none' }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setCampaignToDelete(c)}
                        className="btn btn-danger"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete/Archive Confirmation Modal */}
      {campaignToDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '440px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ marginBottom: '0.5rem' }}>Archive Campaign</h3>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
                lineHeight: 1.5,
              }}
            >
              Are you sure you want to remove <strong>"{campaignToDelete.title}"</strong> from public listings? All past donor receipts and donation contribution histories will remain safely preserved in audit records.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-outline"
                disabled={deleting}
                onClick={() => setCampaignToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={deleting}
                onClick={confirmDelete}
              >
                {deleting ? 'Removing...' : 'Confirm Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import api from '../services/api';
import ErrorBanner from '../components/ErrorBanner';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // User pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Modal & user donation state
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDonations, setUserDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [donationsError, setDonationsError] = useState('');
  const [donationsPage, setDonationsPage] = useState(1);
  const [donationsTotalPages, setDonationsTotalPages] = useState(1);
  const [totalDonatedAmount, setTotalDonatedAmount] = useState(0);

  const fetchUsers = async (targetPage = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/users?page=${targetPage}&limit=10`);
      setUsers(res?.users || []);
      setPage(res?.page || 1);
      setTotalPages(res?.totalPages || 1);
      setTotalUsers(res?.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load user accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const openDonationHistory = async (user, targetPage = 1) => {
    setSelectedUser(user);
    setDonationsLoading(true);
    setDonationsError('');
    try {
      const res = await api.get(`/donations/user/${user._id}?page=${targetPage}&limit=10`);
      const payload = res?.data || {};
      const donations = payload.donations || [];
      
      setUserDonations(donations);
      setDonationsPage(payload.page || 1);
      setDonationsTotalPages(payload.totalPages || 1);

      // Aggregate sum for current viewed user records
      const sum = donations.reduce((acc, d) => acc + (d.amount || 0), 0);
      setTotalDonatedAmount(sum);
    } catch (err) {
      setDonationsError(err.message || 'Failed to load donation history for this user.');
    } finally {
      setDonationsLoading(false);
    }
  };

  const closeDonationModal = () => {
    setSelectedUser(null);
    setUserDonations([]);
    setDonationsError('');
  };

  return (
    <div className="container" style={{ maxWidth: '1100px', margin: '2rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>User Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Review registered platform accounts and inspect donor histories ({totalUsers} total users).
          </p>
        </div>
      </div>

      <ErrorBanner message={error} onClose={() => setError('')} />

      {loading ? (
        <p>Loading user directories...</p>
      ) : (
        <div className="card" style={{ overflowX: 'auto', padding: '0.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem' }}>User</th>
                <th style={{ padding: '1rem' }}>Contact</th>
                <th style={{ padding: '1rem' }}>Role</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Joined</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>
                    {u.firstName} {u.lastName}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                    <div>{u.email}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{u.phone || 'No phone'}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge badge-${u.role}`}>{u.role}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span 
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: u.isActive !== false ? '#dcfce7' : '#fee2e2',
                        color: u.isActive !== false ? '#15803d' : '#b91c1c'
                      }}
                    >
                      {u.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                      onClick={() => openDonationHistory(u, 1)}
                    >
                      View Donations
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* User Pagination Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Page {page} of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-outline"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
              <button
                className="btn btn-outline"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donation History Modal */}
      {selectedUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                  Donation History: {selectedUser.firstName} {selectedUser.lastName}
                </h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedUser.email}</span>
              </div>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '0.25rem 0.6rem' }}
                onClick={closeDonationModal}
              >
                ✕
              </button>
            </div>

            <ErrorBanner message={donationsError} onClose={() => setDonationsError('')} />

            {donationsLoading ? (
              <p style={{ padding: '2rem 0', textAlign: 'center' }}>Retrieving contributions...</p>
            ) : userDonations.length === 0 ? (
              <div style={{ padding: '2.5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                This user has not contributed to any campaigns yet.
              </div>
            ) : (
              <div>
                <div 
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border)',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Screened Contributions:</span>
                  <strong style={{ color: 'var(--primary)' }}>₦{totalDonatedAmount.toLocaleString()}</strong>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th style={{ padding: '0.65rem' }}>Campaign</th>
                      <th style={{ padding: '0.65rem' }}>Amount</th>
                      <th style={{ padding: '0.65rem' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userDonations.map((d) => (
                      <tr key={d._id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.65rem', fontWeight: 500 }}>
                          {d.campaign?.title || 'Unknown or Closed Campaign'}
                        </td>
                        <td style={{ padding: '0.65rem', fontWeight: 700, color: '#15803d' }}>
                          ₦{d.amount?.toLocaleString()}
                        </td>
                        <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>
                          {new Date(d.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Donation Modal Pagination */}
                {donationsTotalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Page {donationsPage} of {donationsTotalPages}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                        disabled={donationsPage <= 1}
                        onClick={() => openDonationHistory(selectedUser, donationsPage - 1)}
                      >
                        Prev
                      </button>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                        disabled={donationsPage >= donationsTotalPages}
                        onClick={() => openDonationHistory(selectedUser, donationsPage + 1)}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-primary" onClick={closeDonationModal}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
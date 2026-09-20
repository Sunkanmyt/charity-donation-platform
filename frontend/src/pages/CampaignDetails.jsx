import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DonationModal from '../components/DonationModal';
import ErrorBanner from '../components/ErrorBanner';

export default function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [campaign, setCampaign] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    try {
      const campRes = await api.get(`/campaigns/${id}`);
      setCampaign(campRes.data);

      const donRes = await api.get(`/donations/campaign/${id}`);
      setDonations(donRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch campaign details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleDonateClick = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/campaigns/${id}` } } });
      return;
    }
    setShowModal(true);
  };

  if (loading) return <div className="container" style={{ padding: '3rem' }}>Loading campaign...</div>;
  if (!campaign) return <div className="container"><ErrorBanner message="Campaign not found." /></div>;

  const progress = Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100));

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <ErrorBanner message={error} onClose={() => setError('')} />

      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <img 
          src={campaign.imageUrl} 
          alt={campaign.title} 
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '6px', marginBottom: '1.5rem' }} 
        />
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <span className="badge badge-category">{campaign.category}</span>
          <span className={`badge badge-${campaign.status}`}>{campaign.status}</span>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{campaign.title}</h1>
        <p style={{ fontSize: '1.05rem', color: '#334155', whiteSpace: 'pre-line', marginBottom: '2rem' }}>
          {campaign.description}
        </p>

        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div className="progress-track" style={{ height: '12px' }}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.75rem 0 1.5rem' }}>
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>${campaign.raisedAmount.toLocaleString()}</span>
              <span style={{ color: 'var(--text-muted)' }}> raised of ${campaign.targetAmount.toLocaleString()}</span>
            </div>
            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{progress}% Funded</span>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.9rem', fontSize: '1.1rem' }}
            onClick={handleDonateClick}
            disabled={campaign.status === 'completed'}
          >
            {campaign.status === 'completed' ? 'Campaign Goal Met' : 'Donate to This Cause'}
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Recent Supporters ({donations.length})</h3>
        {donations.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Be the first to donate to this cause!</p>
        ) : (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {donations.map((d) => (
              <li key={d._id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                <span>{d.anonymous ? 'Anonymous Supporter' : d.donor?.name || 'Supporter'}</span>
                <strong>${d.amount.toLocaleString()}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && (
        <DonationModal
          campaignId={campaign._id}
          campaignTitle={campaign.title}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}
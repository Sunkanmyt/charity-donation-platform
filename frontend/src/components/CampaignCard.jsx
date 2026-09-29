import { Link } from 'react-router-dom';

export default function CampaignCard({ campaign }) {
  const progress = Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100));

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <img 
        src={campaign.imageUrl || 'https://placehold.co/600x350?text=Campaign'} 
        alt={campaign.title} 
        style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
      />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span className="badge badge-category">{campaign.category}</span>
          <span className={`badge badge-${campaign.status}`}>{campaign.status}</span>
        </div>

        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', flexGrow: 1 }}>{campaign.title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {campaign.description}
        </p>

        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', margin: '0.5rem 0 1rem' }}>
          <strong>${campaign.raisedAmount.toLocaleString()}</strong>
          <span style={{ color: 'var(--text-muted)' }}>Goal: ${campaign.targetAmount.toLocaleString()}</span>
        </div>

        <Link to={`/campaigns/${campaign._id}`} className="btn btn-primary" style={{ width: '100%' }}>
          View Details & Donate
        </Link>
      </div>
    </div>
  );
}
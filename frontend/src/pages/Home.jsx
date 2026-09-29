import { useState, useEffect } from 'react';
import api from '../services/api';
import CampaignCard from '../components/CampaignCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import ErrorBanner from '../components/ErrorBanner';

const CATEGORIES = ['All', 'Education', 'Healthcare', 'Disaster Relief', 'Community Development'];

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCampaigns = async () => {
    setLoading(true);
    setError('');
    try {
      const catQuery = category !== 'All' ? `&category=${category}` : '';
      const searchQuery = search ? `&search=${encodeURIComponent(search)}` : '';
      const response = await api.get(`/campaigns?page=${page}&limit=6${catQuery}${searchQuery}`);
      setCampaigns(response.data.campaigns || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Unable to load campaigns.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [category, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCampaigns();
  };

  return (
    <div className="container">
      <section style={{ textAlign: 'center', margin: '2rem 0 3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Transparent Giving, Real Impact
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          Discover verified charitable campaigns and track your personal impact in real-time.
        </p>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', maxWidth: '500px', margin: '0 auto 1.5rem', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Search campaigns by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flexGrow: 1, padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '6px' }}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`btn ${category === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <ErrorBanner message={error} onClose={() => setError('')} />

      {loading ? (
        <LoadingSkeleton count={6} />
      ) : campaigns.length === 0 ? (
        <EmptyState title="No campaigns found" description="Try selecting another category or clear your search query." />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {campaigns.map((camp) => (
              <CampaignCard key={camp._id} campaign={camp} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
        </>
      )}
    </div>
  );
}
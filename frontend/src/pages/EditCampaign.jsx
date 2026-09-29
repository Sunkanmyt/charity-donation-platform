import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import ErrorBanner from '../components/ErrorBanner';

export default function EditCampaign() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Community Development',
    targetAmount: '',
    description: '',
    status: 'active',
  });
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await api.get(`/campaigns/${id}`);
        // Handle unwrapped vs nested response shape
        const campaign = res.data || res;

        setFormData({
          title: campaign.title || '',
          category: campaign.category || 'Community Development',
          targetAmount: campaign.targetAmount || '',
          description: campaign.description || '',
          status: campaign.status || 'active',
        });
        setExistingImageUrl(campaign.imageUrl || '');
      } catch (err) {
        setError(err.message || 'Failed to load campaign details.');
      } finally {
        setFetching(false);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB.');
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleCancelNewImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(formData.targetAmount) <= 0) {
      setError('Target amount must be greater than zero.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('category', formData.category);
      payload.append('targetAmount', Number(formData.targetAmount));
      payload.append('description', formData.description.trim());
      payload.append('status', formData.status);

      // Only append if replacing with a new file
      if (imageFile) {
        payload.append('image', imageFile);
      }

      await api.put(`/campaigns/${id}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to update campaign.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container" style={{ maxWidth: '650px', textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading campaign details...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '650px' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Edit Campaign</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Update project details, funding targets, or completion status.
        </p>

        <ErrorBanner message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              Campaign Title
            </label>
            <input
              type="text"
              name="title"
              required
              maxLength={120}
              value={formData.title}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '6px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '6px' }}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '6px' }}
              >
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Disaster Relief">Disaster Relief</option>
                <option value="Community Development">Community Development</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              Target Amount ($)
            </label>
            <input
              type="number"
              name="targetAmount"
              min="10"
              required
              value={formData.targetAmount}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '6px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              Campaign Cover Image
            </label>

            {/* Display current image if no new replacement file chosen */}
            {existingImageUrl && !previewUrl && (
              <div style={{ marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  Current Active Banner:
                </span>
                <img
                  src={existingImageUrl}
                  alt="Current cover"
                  style={{
                    width: '100%',
                    maxHeight: '180px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                  }}
                />
              </div>
            )}

            {/* Display newly selected replacement preview */}
            {previewUrl && (
              <div style={{ marginBottom: '0.8rem', position: 'relative' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  New Image Selected:
                </span>
                <img
                  src={previewUrl}
                  alt="New preview"
                  style={{
                    width: '100%',
                    maxHeight: '180px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                  }}
                />
                <button
                  type="button"
                  onClick={handleCancelNewImage}
                  style={{
                    position: 'absolute',
                    top: '26px',
                    right: '8px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel Replace
                </button>
              </div>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              Description & Objectives
            </label>
            <textarea
              name="description"
              rows="5"
              required
              value={formData.description}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '6px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Saving Changes...' : 'Update Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
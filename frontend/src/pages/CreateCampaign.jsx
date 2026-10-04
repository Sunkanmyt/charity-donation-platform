import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ErrorBanner from '../components/ErrorBanner';

export default function CreateCampaign() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Community Development',
    targetAmount: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

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

  const handleRemoveImage = () => {
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

      // Only append if the admin chose a custom file
      if (imageFile) {
        payload.append('image', imageFile);
      }

      await api.post('/campaigns', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create campaign.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '650px' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Launch New Campaign</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Create a verified fundraising project on the platform.
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

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Target Amount (₦)
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
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              Campaign Cover Image
              <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.4rem', fontSize: '0.8rem' }}>
                (Optional — default image will be applied if empty)
              </span>
            </label>
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

            {previewUrl && (
              <div style={{ marginTop: '0.8rem', position: 'relative' }}>
                <img
                  src={previewUrl}
                  alt="Campaign preview"
                  style={{
                    width: '100%',
                    maxHeight: '220px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    position: 'absolute',
                    top: '8px',
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
                  Remove Image
                </button>
              </div>
            )}
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
              {loading ? 'Publishing...' : 'Publish Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
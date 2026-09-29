export default function EmptyState({ title = "No items found", description = "Try adjusting your search or filters." }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '8px', border: '1px dashed var(--border)' }}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{description}</p>
    </div>
  );
}
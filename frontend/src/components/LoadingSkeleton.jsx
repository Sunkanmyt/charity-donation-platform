export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ padding: '1.5rem', opacity: 0.6 }}>
          <div style={{ height: '160px', background: '#e2e8f0', borderRadius: '6px', marginBottom: '1rem' }} />
          <div style={{ height: '18px', width: '60%', background: '#e2e8f0', marginBottom: '0.5rem' }} />
          <div style={{ height: '14px', width: '90%', background: '#e2e8f0', marginBottom: '1rem' }} />
          <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px' }} />
        </div>
      ))}
    </div>
  );
}
export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px',
      textAlign: 'center',
      background: '#f5f5f5'
    }}>
      <div style={{
        maxWidth: '600px',
        padding: '40px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>
          404 - Page Not Found
        </h1>
        <p style={{ marginBottom: '24px', color: '#666', fontSize: '1.125rem' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <a 
          href="/" 
          style={{ 
            display: 'inline-block',
            padding: '12px 24px',
            background: '#4299e1',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '1rem'
          }}
        >
          Go back home
        </a>
      </div>
    </div>
  );
} 
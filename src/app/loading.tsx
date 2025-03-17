'use client';

export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%',
      background: 'rgba(255, 255, 255, 0.8)'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #2d3448',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        {/* @ts-ignore */}
        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ 
          fontWeight: 'bold',
          color: '#2d3448'
        }}>
          Loading...
        </p>
      </div>
    </div>
  )
} 
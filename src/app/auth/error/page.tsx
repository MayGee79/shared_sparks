'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#f5f5f5' 
    }}>
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          color: '#333'
        }}>
          Authentication Error
        </h2>
        <p style={{ 
          marginBottom: '1rem',
          color: '#e53e3e'
        }}>
          {error || 'An error occurred during authentication.'}
        </p>
        <a 
          href="/auth/login" 
          style={{ 
            display: 'block',
            width: '100%',
            padding: '0.5rem',
            textAlign: 'center',
            background: '#4299e1',
            color: 'white',
            borderRadius: '0.25rem',
            textDecoration: 'none'
          }}
        >
          Back to Login
        </a>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <React.Suspense fallback={
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#f5f5f5' 
      }}>
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '0.5rem', 
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            color: '#333'
          }}>
            Loading...
          </h2>
        </div>
      </div>
    }>
      <ErrorContent />
    </React.Suspense>
  );
}

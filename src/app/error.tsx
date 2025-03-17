'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

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
          Something went wrong!
        </h1>
        <p style={{ marginBottom: '24px', color: '#666', fontSize: '1.125rem' }}>
          We apologize for the inconvenience. Please try again.
        </p>
        <button
          onClick={() => reset()}
          style={{ 
            padding: '12px 24px',
            background: '#4299e1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Try again
        </button>
      </div>
    </div>
  )
} 
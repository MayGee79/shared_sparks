'use client';

import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

// Note: Using standard HTML img tags instead of Next.js Image components
// due to type compatibility issues in Next.js 14.2.24 with server components.
// TODO: Revisit when upgrading Next.js or when the issue is resolved.

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('User');
  
  useEffect(() => {
    // This effect runs only in the browser, after hydration
    // In a real app, you would check authentication status here
    // For now, we'll just simulate it
    setTimeout(() => {
      setIsAuthenticated(false); // Set to true to simulate logged-in user
      setUserName('Guest User');
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        maxWidth: '800px', 
        margin: '0 auto' 
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        maxWidth: '800px', 
        margin: '0 auto' 
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Please log in to view your profile.</h2>
        <a 
          href="/auth/signin" 
          style={{ 
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: '#4299e1',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.25rem'
          }}
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto' 
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        marginBottom: '1.5rem' 
      }}>
        Welcome, {userName}
      </h1>
      {/* Add your profile content here */}
    </div>
  );
}

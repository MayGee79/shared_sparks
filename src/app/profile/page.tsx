'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

// Note: Using standard HTML img tags instead of Next.js Image components
// due to type compatibility issues in Next.js 14.2.24 with server components.
// TODO: Revisit when upgrading Next.js or when the issue is resolved.

interface CollaborationRequest {
  id: string;
  sender: {
    name: string;
  };
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  
  // Wrap session access in a try-catch to handle prerendering
  let sessionStatus = 'loading';
  let sessionData = null;
  
  try {
    const { data, status } = useSession();
    sessionStatus = status;
    sessionData = data;
  } catch (e) {
    // Handle the error during prerendering
    console.error('Error accessing session during prerendering:', e);
  }
  
  useEffect(() => {
    // This effect runs only in the browser, after hydration
    try {
      const { data, status } = useSession();
      if (status === 'authenticated' && data?.user?.name) {
        setUserName(data.user.name);
      }
      setIsLoading(false);
    } catch (e) {
      console.error('Error accessing session in useEffect:', e);
      setIsLoading(false);
    }
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

  if (sessionStatus === 'unauthenticated' || !sessionData) {
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
        Welcome, {userName || (sessionData?.user?.name || 'User')}
      </h1>
      {/* Add your profile content here */}
    </div>
  );
}

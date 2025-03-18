'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/user/profile')
      const data = await response.json()
      
      if (!data.hasCompletedOnboarding) {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      router.push('/dashboard') // Default to dashboard on error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (result?.error) {
        setErrorMessage('Invalid email or password')
        setIsLoading(false)
        return
      }
      
      // Check if user needs to complete onboarding
      await checkOnboardingStatus()
    } catch (error) {
      setErrorMessage('An error occurred during login')
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', {
      callbackUrl: '/api/auth/signin-callback', // Use a callback endpoint
      redirect: true,
    })
  }

  const handleGithubSignIn = () => {
    signIn('github', {
      callbackUrl: '/api/auth/signin-callback', // Use a callback endpoint
      redirect: true,
    })
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--background)'
    }}>
      <div 
        style={{
          background: 'var(--primary)',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1.5rem', 
          color: 'white',
          textAlign: 'center'
        }}>
          Log In
        </h2>
        
        {errorMessage && (
          <div style={{
            padding: '0.5rem',
            backgroundColor: '#FEE2E2',
            color: '#B91C1C',
            borderRadius: '0.25rem',
            marginBottom: '1rem'
          }}>
            {errorMessage}
          </div>
        )}
        
        <form 
          onSubmit={handleSubmit} 
          style={{
            marginBottom: '1.5rem'
          }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              border: '1px solid #cbd5e0',
              borderRadius: '0.375rem',
              padding: '0.75rem',
              marginBottom: '1rem',
              width: '100%',
              backgroundColor: 'white',
              color: 'var(--primary)'
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              border: '1px solid #cbd5e0',
              borderRadius: '0.375rem',
              padding: '0.75rem',
              marginBottom: '1.5rem',
              width: '100%',
              backgroundColor: 'white',
              color: 'var(--primary)'
            }}
            required
          />
          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'var(--accent)',
              color: 'var(--primary)',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In with Email'}
          </button>
        </form>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }}></div>
          <span style={{ padding: '0 0.75rem', color: 'white' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }}></div>
        </div>
        
        <button 
          onClick={handleGoogleSignIn}
          type="button" 
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1rem',
            background: 'white',
            color: '#333',
            border: 'none',
            borderRadius: '0.375rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24" style={{ marginRight: '0.75rem' }}>
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          Sign in with Google
        </button>

        <button 
          onClick={handleGithubSignIn}
          type="button" 
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#24292e',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ marginRight: '0.75rem' }}>
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="white"/>
          </svg>
          Sign in with GitHub
        </button>
        
        <div style={{ 
          marginTop: '1.5rem', 
          textAlign: 'center',
          color: 'white' 
        }}>
          <span>Don't have an account? </span>
          <a href="/auth/register" style={{ 
            color: 'var(--accent)',
            fontWeight: 'bold'
          }}>Register</a>
        </div>
      </div>
    </div>
  )
} 
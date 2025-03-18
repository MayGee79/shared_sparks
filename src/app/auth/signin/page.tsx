'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LinkWrapper } from './components/LinkWrapper'

type LoginFormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()

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

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
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
      background: '#f5f5f5'
    }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>Sign In</h2>
        
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
        
        <input
          type="email"
          placeholder="Email"
          {...register('email')}
          style={{
            border: '1px solid #ccc',
            padding: '0.5rem',
            marginBottom: '1rem',
            width: '100%'
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          {...register('password')}
          style={{
            border: '1px solid #ccc',
            padding: '0.5rem',
            marginBottom: '1rem',
            width: '100%'
          }}
          required
        />
        <button 
          type="submit" 
          style={{
            width: '100%',
            padding: '0.5rem',
            background: '#4299e1',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

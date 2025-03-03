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

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setErrorMessage('Invalid email or password')
        return
      }
      router.push('/')
      router.refresh()
    } catch {
      setErrorMessage('An error occurred during login')
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', {
      callbackUrl: '/dashboard',
      redirect: true,
    })
  }

  const handleGithubSignIn = () => {
    signIn('github', {
      callbackUrl: '/dashboard',
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
        <button type="submit" style={{
          width: '100%',
          padding: '0.5rem',
          background: '#4299e1',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem'
        }}>
          Sign In
        </button>
      </form>
    </div>
  )
}

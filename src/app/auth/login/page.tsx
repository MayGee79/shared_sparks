'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
    if (result?.ok) router.push('/dashboard')
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f5f5f5'
    }}>
      <form 
        onSubmit={handleSubmit} 
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Log In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
            borderRadius: '0.25rem'
          }}
        >
          Log In
        </button>
      </form>
    </div>
  )
} 
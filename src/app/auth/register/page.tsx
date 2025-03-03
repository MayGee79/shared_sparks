'use client'

// Note: Using standard HTML img tags instead of Next.js Image components
// due to type compatibility issues in Next.js 14.2.24 with server components.
// TODO: Revisit when upgrading Next.js or when the issue is resolved.

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Replace with your own registration logic/API
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, name, password }),
      headers: { 'Content-Type': 'application/json' }
    })
    if (res.ok) {
      router.push('/auth/login')
    }
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
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ 
            border: '1px solid #ccc',
            padding: '0.5rem',
            marginBottom: '1rem',
            width: '100%' 
          }}
          required
        />
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
          Register
        </button>
      </form>
    </div>
  )
}

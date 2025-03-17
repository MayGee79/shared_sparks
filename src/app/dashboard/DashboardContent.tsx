'use client'

import React, { useState, useEffect } from 'react'

function DashboardWithSession() {
  const [userName, setUserName] = useState('User')
  
  useEffect(() => {
    // In a real app, you would fetch user data here
    // For now, we'll just use a placeholder
    setUserName('Guest User')
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Dashboard</h1>
      <p>Welcome, {userName}</p>
    </div>
  )
}

export default function DashboardContent() {
  return (
    <React.Suspense fallback={
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Dashboard</h1>
        <p>Loading...</p>
      </div>
    }>
      <DashboardWithSession />
    </React.Suspense>
  )
} 
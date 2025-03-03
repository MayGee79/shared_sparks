'use client'

import { useSession } from 'next-auth/react'
import React from 'react'

function DashboardWithSession() {
  const { data: session } = useSession()

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Dashboard</h1>
      <p>Welcome, {session?.user?.name || 'User'}</p>
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
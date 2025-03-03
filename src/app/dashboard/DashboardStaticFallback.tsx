'use client'

import { useEffect, useState } from 'react'
import DashboardWrapper from './DashboardWrapper'

export default function DashboardStaticFallback() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) {
    // This is what will be prerendered
    return (
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Dashboard</h1>
        <p>Loading your dashboard...</p>
      </div>
    )
  }
  
  // This will only run on the client
  return <DashboardWrapper />
} 
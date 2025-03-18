'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const sessionResult = useSession()
  const status = sessionResult?.status || 'loading'
  const session = sessionResult?.data || null
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      // Check if user has completed onboarding
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (!data.hasCompletedOnboarding) {
            router.push('/onboarding')
            return
          }
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Error fetching profile:', error)
          setIsLoading(false)
        })
    }
  }, [status, router])

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-3xl mx-auto bg-primary rounded-lg shadow-xl p-8">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4 text-white">Loading...</h2>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-3xl mx-auto bg-primary rounded-lg shadow-xl p-8">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4 text-white">
              Please log in to access your dashboard.
            </h2>
            <a 
              href="/auth/signin"
              className="inline-block px-4 py-2 bg-accent text-primary font-bold rounded hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto bg-primary rounded-lg shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-white">Dashboard</h1>
        <p className="mb-6 text-white/80">
          Welcome to your dashboard! This is where you can view your activity and manage your account.
        </p>
        
        <div className="bg-primary-light rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-accent">0</h3>
              <p className="text-white/70">Ideas Shared</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-accent">0</h3>
              <p className="text-white/70">Comments</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-accent">0</h3>
              <p className="text-white/70">Connections</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
          <button className="px-4 py-2 bg-accent text-primary text-sm font-bold rounded-full hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors duration-300">
            View All
          </button>
        </div>
        
        <div className="bg-primary-light rounded-lg p-6 mb-6">
          <div className="text-center text-white/70 py-8">
            No activity yet. Start by sharing an idea or connecting with other users!
          </div>
        </div>
        
        <div className="flex justify-center">
          <button className="px-6 py-3 bg-accent text-primary font-bold rounded-full hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors duration-300">
            + Share New Idea
          </button>
        </div>
      </div>
    </div>
  )
}
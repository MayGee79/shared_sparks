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
        <div className="max-w-6xl mx-auto bg-primary rounded-lg shadow-xl p-8">
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
        <div className="max-w-6xl mx-auto bg-primary rounded-lg shadow-xl p-8">
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
      <div className="max-w-6xl mx-auto bg-primary rounded-lg shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <div>
            <button className="px-4 py-2 bg-accent text-primary font-bold rounded-full hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors duration-300">
              + New Idea
            </button>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="md:col-span-2">
            <div className="bg-primary-light rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
              
              <div className="space-y-4">
                {/* Activity Items */}
                {[1, 2, 3].map(item => (
                  <div key={item} className="bg-primary/50 p-4 rounded-lg border border-white/10">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-accent flex-shrink-0"></div>
                      <div className="ml-3 flex-grow">
                        <p className="text-white font-medium">User commented on your idea</p>
                        <p className="text-white/70 text-sm">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Ideas Section */}
            <div className="bg-primary-light rounded-lg p-6 mt-6">
              <h2 className="text-xl font-semibold text-white mb-4">Your Ideas</h2>
              
              <div className="space-y-4">
                {/* Idea Items */}
                {[1, 2].map(item => (
                  <div key={item} className="bg-primary/50 p-4 rounded-lg border border-white/10">
                    <h3 className="text-lg font-semibold text-white">Idea Title</h3>
                    <p className="text-white/70 mt-1">Short description of the idea goes here...</p>
                    <div className="flex mt-3 space-x-2">
                      <span className="bg-accent/20 text-accent text-xs px-2 py-1 rounded">Tag</span>
                      <span className="bg-accent/20 text-accent text-xs px-2 py-1 rounded">Tag</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            {/* Profile Card */}
            <div className="bg-primary-light rounded-lg p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-accent mb-4"></div>
                <h2 className="text-xl font-bold text-white">{session?.user?.name || 'User'}</h2>
                <p className="text-white/70">{session?.user?.email || 'user@example.com'}</p>
                
                <button className="mt-4 w-full px-4 py-2 bg-white/10 text-white text-sm rounded-md hover:bg-white/20">
                  Edit Profile
                </button>
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="bg-primary-light rounded-lg p-6 mt-6">
              <h2 className="text-lg font-semibold text-white mb-3">Your Stats</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Ideas Shared</span>
                  <span className="text-white font-medium">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Comments</span>
                  <span className="text-white font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Connections</span>
                  <span className="text-white font-medium">8</span>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="bg-primary-light rounded-lg p-6 mt-6">
              <h2 className="text-lg font-semibold text-white mb-3">Quick Links</h2>
              
              <div className="space-y-2">
                <a href="#" className="block text-accent hover:underline">Explore Ideas</a>
                <a href="#" className="block text-accent hover:underline">Find Collaborators</a>
                <a href="#" className="block text-accent hover:underline">SaaS Solutions</a>
                <a href="#" className="block text-accent hover:underline">Settings</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
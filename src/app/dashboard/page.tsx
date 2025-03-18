'use client'

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

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

  const activityData = {
    labels: ['May 1', 'May 2', 'May 3', 'May 4', 'May 5', 'May 6', 'May 7'],
    datasets: [{
      data: [30, 40, 35, 50, 45, 60, 55],
      borderColor: 'var(--accent)',
      tension: 0.4,
      fill: false,
    }]
  }

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
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Left Sidebar */}
      <div className="w-64 bg-accent p-6 flex flex-col fixed h-full">
        <div className="text-center mb-8">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'Profile'}
              width={96}
              height={96}
              className="rounded-full mx-auto mb-4"
            />
          ) : (
            <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
              {session?.user?.name?.charAt(0) || '?'}
            </div>
          )}
          <h2 className="text-primary font-bold text-xl">
            {session?.user?.name || 'Welcome!'}
          </h2>
          <p className="text-primary text-sm">
            {session?.user?.email}
          </p>
        </div>

        <nav className="flex-1 space-y-3">
          <button className="w-full text-left font-bold text-primary px-4 py-2">
            Dashboard
          </button>
          <a href="/profile" className="block w-full text-left font-bold text-primary px-4 py-2">
            Profile
          </a>
          <button className="w-full text-left font-bold text-primary px-4 py-2">
            Search
          </button>
          <button className="w-full text-left font-bold text-primary px-4 py-2">
            Offer
          </button>
          <button className="w-full text-left font-bold text-primary px-4 py-2">
            Insight
          </button>
          <button className="w-full text-left font-bold text-primary px-4 py-2">
            Community
          </button>
        </nav>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full px-4 py-2 bg-primary text-white rounded font-bold"
        >
          Log Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 bg-background">
        {/* Banner */}
        <div className="w-full flex justify-center py-4">
          <h1 className="text-4xl font-bold text-primary">Shared Sparks</h1>
        </div>

        {/* Content wrapper with padding */}
        <div className="px-8 pb-16">
          {/* Top Three Boxes */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Stats Box */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-primary">Searched</span>
                  <span className="font-bold text-primary">22.6k</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary">Requested</span>
                  <span className="font-bold text-primary">219.3k</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary">Offered</span>
                  <span className="font-bold text-primary">1.5k</span>
                </div>
              </div>
            </div>

            {/* Activity Graph Box */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-sm text-primary mb-2">Activity</h3>
              <div className="h-32">
                <Line data={activityData} options={{
                  plugins: { legend: { display: false } },
                  scales: { y: { display: false }, x: { display: false } }
                }} />
              </div>
            </div>

            {/* Community Box */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-primary mb-4">Popular Discussions</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-primary">Popular Post Example:</span>
                  <span className="text-accent">15 comments</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary">Popular Post Example:</span>
                  <span className="text-accent">15 comments</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary">Popular Post Example:</span>
                  <span className="text-accent">15 comments</span>
                </div>
                <button className="w-full bg-accent text-primary py-2 rounded font-bold mt-4">
                  Join the Discussion
                </button>
              </div>
            </div>
          </div>

          {/* Two Main Columns */}
          <div className="grid grid-cols-2 gap-8">
            {/* Looking for SaaS Column */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-primary">Looking for SaaS</h2>
              
              {/* Search Widget */}
              <div className="bg-primary rounded-lg p-6 shadow-md">
                <h3 className="text-white font-bold mb-4">Looking for SaaS</h3>
                <input
                  type="text"
                  placeholder="Find SaaS solutions..."
                  className="w-full p-2 rounded mb-4"
                />
                <button className="w-full bg-accent text-primary py-2 rounded font-bold">
                  Search
                </button>
              </div>

              {/* Saved Searches */}
              <div className="bg-primary rounded-lg p-6 shadow-md">
                <h3 className="text-white font-bold mb-4">Saved Searches</h3>
                <p className="text-white/70">No saved searches yet</p>
              </div>

              {/* Recommended SaaS */}
              <div className="bg-primary rounded-lg p-6 shadow-md">
                <h3 className="text-white font-bold mb-4">Recommended SaaS</h3>
                <p className="text-white/70">No recommendations yet</p>
              </div>

              {/* Can't Find It? */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-primary font-bold mb-4">Not finding what you need?</h3>
                <button className="w-full bg-accent text-primary py-2 rounded font-bold">
                  Submit a Request
                </button>
              </div>

              {/* My Requests */}
              <div className="bg-primary rounded-lg p-6 shadow-md">
                <h3 className="text-white font-bold mb-4">My Requests</h3>
                <p className="text-white/70">No active requests</p>
              </div>
            </div>

            {/* Offering SaaS Column */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-primary">Offering SaaS</h2>
              
              {/* Demand Trends */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-primary font-bold mb-4">Demand Trends</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-primary">AI-Powered Analytics</span>
                    <span className="text-primary">32 requests</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary">No-Code Development</span>
                    <span className="text-primary">28 requests</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary">Remote Collaboration</span>
                    <span className="text-primary">25 requests</span>
                  </div>
                  <button className="w-full text-accent text-left mt-2">
                    Explore More Requests →
                  </button>
                </div>
              </div>

              {/* My Submissions */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-primary font-bold mb-4">My Submissions</h3>
                <div className="flex justify-between items-center">
                  <span className="text-primary">Project Management Tool</span>
                  <span className="text-green-500">Live</span>
                </div>
                <button className="w-full text-accent text-left mt-4">
                  View All Submissions →
                </button>
              </div>

              {/* Demand Trends (repeated as in the image) */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-primary font-bold mb-4">Demand Trends</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-primary">AI Integration</span>
                    <span className="text-primary">32 requests</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary">No-Code Development</span>
                    <span className="text-primary">28 requests</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary">Remote Collaboration</span>
                    <span className="text-primary">25 requests</span>
                  </div>
                  <button className="w-full text-accent text-left mt-2">
                    Explore More Requests →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
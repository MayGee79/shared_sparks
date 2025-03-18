'use client'

import { signOut, useSession } from 'next-auth/react'
import { Line } from 'react-chartjs-2'
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
import { redirect } from 'next/navigation'

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
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/login')
    },
  })

  console.log('Session:', session)
  console.log('Status:', status)

  const activityData = {
    labels: ['May 1', 'May 2', 'May 3', 'May 4', 'May 5', 'May 6', 'May 7'],
    datasets: [{
      data: [30, 40, 35, 50, 45, 60, 55],
      borderColor: '#f4b941',
      tension: 0.4,
      fill: false,
    }]
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#f4b941] p-6 flex flex-col fixed h-full">
        <div className="text-center mb-8">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'Profile'}
              width={96}
              height={96}
              className="rounded-full mx-auto mb-4"
              style={{ width: '96px', height: '96px', objectFit: 'cover' }}
            />
          ) : (
            <div className="w-24 h-24 bg-[#100359] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
              {session?.user?.name?.charAt(0) || '?'}
            </div>
          )}
          <h2 className="text-[#100359] font-bold text-xl">
            {session?.user?.name || 'Welcome!'}
          </h2>
          <p className="text-[#100359] text-sm">
            {session?.user?.email}
          </p>
        </div>

        <nav className="flex-1 space-y-3">
          <button className="w-full text-left font-bold text-[#100359] px-4 py-2">
            Dashboard
          </button>
          <a href="/profile" className="block w-full text-left font-bold text-[#100359] px-4 py-2">
            Profile
          </a>
          <button className="w-full text-left font-bold text-[#100359] px-4 py-2">
            Search
          </button>
          <button className="w-full text-left font-bold text-[#100359] px-4 py-2">
            Offer
          </button>
          <button className="w-full text-left font-bold text-[#100359] px-4 py-2">
            Insight
          </button>
          <button className="w-full text-left font-bold text-[#100359] px-4 py-2">
            Community
          </button>
        </nav>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full px-4 py-2 bg-[#100359] text-white rounded font-bold"
        >
          Log Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 bg-[#55b7ff]/10">
        {/* Banner */}
        <div className="w-full flex justify-center py-4">
          <img
            src="/header.png"
            alt="Shared Sparks"
            width={600}
            height={150}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>

        {/* Content wrapper with padding */}
        <div className="px-8 pb-16">
          {/* Top Three Boxes */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Stats Box */}
            <div className="bg-white rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Searched</span>
                  <span className="font-bold">22.6k</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Requested</span>
                  <span className="font-bold">219.3k</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Offered</span>
                  <span className="font-bold">1.5k</span>
                </div>
              </div>
            </div>

            {/* Activity Graph Box */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-sm text-gray-500 mb-2">Activity</h3>
              <div className="h-32">
                <Line data={activityData} options={{
                  plugins: { legend: { display: false } },
                  scales: { y: { display: false }, x: { display: false } }
                }} />
              </div>
            </div>

            {/* Community Box */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-bold mb-4">Popular Discussions</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Popular Post Example:</span>
                  <span className="text-blue-500">15 comments</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Popular Post Example:</span>
                  <span className="text-blue-500">15 comments</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Popular Post Example:</span>
                  <span className="text-blue-500">15 comments</span>
                </div>
                <button className="w-full bg-[#f4b941] text-[#100359] py-2 rounded font-bold mt-4">
                  Join the Discussion
                </button>
              </div>
            </div>
          </div>

          {/* Two Main Columns */}
          <div className="grid grid-cols-2 gap-8">
            {/* Looking for SaaS Column */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#100359]">Looking for SaaS</h2>
              
              {/* Search Widget */}
              <div className="bg-[#100359] rounded-lg p-6">
                <h3 className="text-white font-bold mb-4">Looking for SaaS</h3>
                <input
                  type="text"
                  placeholder="Find SaaS solutions..."
                  className="w-full p-2 rounded mb-4"
                />
                <button className="w-full bg-[#f4b941] text-[#100359] py-2 rounded font-bold">
                  Search
                </button>
              </div>

              {/* Saved Searches */}
              <div className="bg-[#100359] rounded-lg p-6">
                <h3 className="text-white font-bold mb-4">Saved Searches</h3>
                <p className="text-gray-400">No saved searches yet</p>
              </div>

              {/* Recommended SaaS */}
              <div className="bg-[#100359] rounded-lg p-6">
                <h3 className="text-white font-bold mb-4">Recommended SaaS</h3>
                <p className="text-gray-400">No recommendations yet</p>
              </div>

              {/* Can't Find It? */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-[#100359] font-bold mb-4">Not finding what you need?</h3>
                <button className="w-full bg-[#f4b941] text-[#100359] py-2 rounded font-bold">
                  Submit a Request
                </button>
              </div>

              {/* My Requests */}
              <div className="bg-[#100359] rounded-lg p-6">
                <h3 className="text-white font-bold mb-4">My Requests</h3>
                <p className="text-gray-400">No active requests</p>
              </div>
            </div>

            {/* Offering SaaS Column */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#100359]">Offering SaaS</h2>
              
              {/* Demand Trends */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-[#100359] font-bold mb-4">Demand Trends</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>AI-Powered Analytics</span>
                    <span>32 requests</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>No-Code Development</span>
                    <span>28 requests</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Remote Collaboration</span>
                    <span>25 requests</span>
                  </div>
                  <button className="w-full text-[#100359] text-left mt-2">
                    Explore More Requests →
                  </button>
                </div>
              </div>

              {/* My Submissions */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-[#100359] font-bold mb-4">My Submissions</h3>
                <div className="flex justify-between items-center">
                  <span>Project Management Tool</span>
                  <span className="text-green-500">Live</span>
                </div>
                <button className="w-full text-[#100359] text-left mt-4">
                  View All Submissions →
                </button>
              </div>

              {/* Demand Trends (repeated as in the image) */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-[#100359] font-bold mb-4">Demand Trends</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>AI Integration</span>
                    <span>32 requests</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>No-Code Development</span>
                    <span>28 requests</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Remote Collaboration</span>
                    <span>25 requests</span>
                  </div>
                  <button className="w-full text-[#100359] text-left mt-2">
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
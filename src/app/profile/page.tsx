'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'

export default function ProfilePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/')
    },
  })

  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    company: '',
    role: '',
  })

  // Update profile data when session is loaded
  useEffect(() => {
    if (session?.user?.name || session?.user?.email) {
      setProfileData(prev => ({
        ...prev,
        name: session?.user?.name || '',
        email: session?.user?.email || '',
      }))
    }
  }, [session])

  const handleSave = async () => {
    // TODO: Add API call to save profile data
    setIsEditing(false)
  }

  // Show loading state
  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-[#55b7ff]/10">
      {/* Banner */}
      <div className="w-full flex justify-center py-4">
        <Image
          src="/header.png"
          alt="Shared Sparks"
          width={600}
          height={150}
          priority
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Profile Header */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-[#100359] rounded-full relative">
                {session?.user?.image && (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                  />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#100359]">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    profileData.name
                  )}
                </h1>
                <p className="text-gray-500">{profileData.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="mt-1 w-full border rounded-md p-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                    className="mt-1 w-full border rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <input
                    type="text"
                    value={profileData.role}
                    onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                    className="mt-1 w-full border rounded-md p-2"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[#f4b941] text-[#100359] rounded-md font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Bio</h3>
                  <p className="mt-1">{profileData.bio || 'No bio added yet'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Company</h3>
                  <p className="mt-1">{profileData.company || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Role</h3>
                  <p className="mt-1">{profileData.role || 'Not specified'}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[#f4b941] text-[#100359] rounded-md font-bold"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

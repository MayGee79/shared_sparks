'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface CollaborationRequest {
  id: string;
  sender: {
    name: string;
  };
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    profileImage: '',
    // Basic Info
    fullName: '',
    bio: '',
    company: '',
    location: '',
    
    // Professional Background
    industry: '',
    role: '',
    expertise: [] as string[],
    skills: [] as string[],
    
    // Interests and Goals
    interests: [] as string[],
    goals: [] as string[],
    
    // Social Links
    twitter: '',
    linkedin: '',
    github: '',
    
    // Privacy Settings
    allowCollaboration: true,
    profileVisibility: 'public',
    notificationPrefs: {
      newVotes: true,
      newComments: true,
      saasMatches: true
    }
  })

  const [showCollabModal, setShowCollabModal] = useState(false)
  const [collabMessage, setCollabMessage] = useState('')
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          setFormData({
            profileImage: data.profileImage || '',
            fullName: data.name || '',
            bio: data.bio || '',
            company: data.company || '',
            location: data.location || '',
            twitter: data.twitter || '',
            linkedin: data.linkedin || '',
            github: data.github || '',
            industry: data.industry || '',
            role: data.role || '',
            expertise: data.expertise || [],
            skills: data.skills || [],
            interests: data.interests || [],
            goals: data.goals || [],
            allowCollaboration: data.allowCollaboration || true,
            profileVisibility: data.profileVisibility || 'public',
            notificationPrefs: data.notificationPrefs || {
              newVotes: true,
              newComments: true,
              saasMatches: true
            }
          })
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }

    if (session?.user) {
      loadProfile()
    }
  }, [session])

  useEffect(() => {
    const loadCollaborationRequests = async () => {
      try {
        const response = await fetch('/api/collaboration')
        if (response.ok) {
          const data = await response.json()
          setCollaborationRequests(data)
        }
      } catch (error) {
        console.error('Error loading collaboration requests:', error)
      }
    }

    if (session?.user) {
      loadCollaborationRequests()
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    }
  }

  const handleRequest = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      const response = await fetch(`/api/collaboration/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      })

      if (!response.ok) {
        throw new Error('Failed to update request')
      }

      // Remove the request from the list
      setCollaborationRequests(prev => 
        prev.filter(request => request.id !== requestId)
      )
    } catch (error) {
      console.error('Error handling request:', error)
      alert('Failed to update request')
    }
  }

  const handleSendRequest = async () => {
    try {
      const response = await fetch('/api/collaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: 'USER_ID_HERE', // You'll need to get this from somewhere
          message: collabMessage,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send request')
      }

      setShowCollabModal(false)
      setCollabMessage('')
      alert('Collaboration request sent!')
    } catch (error) {
      console.error('Error sending collaboration request:', error)
      alert('Failed to send request')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setFormData(prev => ({ ...prev, profileImage: data.url }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    }
  }

  return (
    <div className="min-h-screen bg-[#55b7ff]/10 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-[#100359] mb-6">Profile Settings</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Section */}
          <section>
            <h2 className="text-xl font-semibold text-[#100359] mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="mb-6">
                <div className="flex items-center space-x-6">
                  <div className="relative w-24 h-24">
                    {formData.profileImage ? (
                      <Image
                        src={formData.profileImage}
                        alt="Profile"
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 text-sm bg-[#55b7ff] text-white rounded-md hover:bg-[#55b7ff]/90"
                    >
                      Change Photo
                    </button>
                    {formData.profileImage && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, profileImage: '' }))}
                        className="px-4 py-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Remove Photo
                      </button>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500">
                      JPG, GIF or PNG. Max size 5MB.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          </section>

          {/* Professional Background Section */}
          <section>
            <h2 className="text-xl font-semibold text-[#100359] mb-4">Professional Background</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Select Industry</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="finance">Finance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Select Role</option>
                  <option value="developer">Developer</option>
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="business_owner">Business Owner</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </section>

          {/* Privacy Settings */}
          <section>
            <h2 className="text-xl font-semibold text-[#100359] mb-4">Privacy Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Visibility</label>
                <select
                  value={formData.profileVisibility}
                  onChange={(e) => setFormData({ ...formData, profileVisibility: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="connections">Connections Only</option>
                </select>
              </div>
            </div>
          </section>

          {/* Social Media Links */}
          <section>
            <h2 className="text-xl font-semibold text-[#100359] mb-4">Social Media Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">GitHub</label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Twitter</label>
                <input
                  type="url"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
          </section>

          {/* Interest Tags */}
          <section>
            <h2 className="text-xl font-semibold text-[#100359] mb-4">Interests</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Your Interests</label>
                <select
                  multiple
                  value={formData.interests}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData({ ...formData, interests: values });
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="ai">Artificial Intelligence</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="finance">Finance</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="productivity">Productivity</option>
                </select>
              </div>
            </div>
          </section>

          {/* Goals */}
          <section>
            <h2 className="text-xl font-semibold text-[#100359] mb-4">Goals</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">What do you want to achieve?</label>
                <select
                  multiple
                  value={formData.goals}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData({ ...formData, goals: values });
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="find_solutions">Find SaaS Solutions</option>
                  <option value="develop_ideas">Develop Ideas</option>
                  <option value="collaborate">Find Collaborators</option>
                  <option value="market_research">Market Research</option>
                  <option value="networking">Professional Networking</option>
                </select>
              </div>
            </div>
          </section>

          {/* Collaboration Preferences */}
          <section>
            <h2 className="text-xl font-semibold text-[#100359] mb-4">Collaboration Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.allowCollaboration}
                    onChange={(e) => setFormData({ ...formData, allowCollaboration: e.target.checked })}
                    className="rounded border-gray-300 text-[#f4b941] focus:ring-[#f4b941]"
                  />
                  <span className="ml-2 text-sm text-gray-700">I'm open to collaboration requests</span>
                </label>
              </div>
            </div>
          </section>

          {/* Collaboration */}
          <section>
            <h2 className="text-xl font-semibold text-[#100359] mb-4">Collaboration</h2>
            <div className="space-y-4">
              <button
                onClick={() => setShowCollabModal(true)}
                className="bg-[#f4b941] text-[#100359] px-4 py-2 rounded-md font-bold hover:bg-[#f4b941]/90"
              >
                Send Collaboration Request
              </button>
              
              {/* Collaboration Requests List */}
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">Pending Requests</h3>
                {collaborationRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                    <span>{request.sender.name}</span>
                    <div className="space-x-2">
                      <button 
                        onClick={() => handleRequest(request.id, 'accept')}
                        className="text-green-600 hover:text-green-800"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleRequest(request.id, 'reject')}
                        className="text-red-600 hover:text-red-800"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#f4b941] text-[#100359] py-2 rounded-md font-bold hover:bg-[#f4b941]/90"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Collaboration Modal */}
      {showCollabModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Send Collaboration Request</h3>
            <textarea
              value={collabMessage}
              onChange={(e) => setCollabMessage(e.target.value)}
              placeholder="Write a message..."
              className="w-full p-2 border rounded-md mb-4"
              rows={4}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCollabModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                className="px-4 py-2 bg-[#f4b941] text-[#100359] rounded-md hover:bg-[#f4b941]/90"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

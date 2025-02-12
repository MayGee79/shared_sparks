'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Onboarding() {
  const { data: session } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    // Basic Info
    fullName: session?.user?.name || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Profile update failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#55b7ff]/10 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <div className="flex flex-col items-center mb-8">
          <Image 
            src="/logo.png" 
            alt="Shared Sparks" 
            width={176}
            height={176}
            className="h-44 w-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-[#100359]">Complete Your Profile</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Section */}
          <section>
            <h2 className="text-xl font-semibold text-[#100359] mb-4">Basic Information</h2>
            <div className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-700">Select Your Interests (hold Ctrl/Cmd to select multiple)</label>
                <select
                  multiple
                  size={6}
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
                <label className="block text-sm font-medium text-gray-700">What do you want to achieve? (hold Ctrl/Cmd to select multiple)</label>
                <select
                  multiple
                  size={5}
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
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.allowCollaboration}
                    onChange={(e) => setFormData({ ...formData, allowCollaboration: e.target.checked })}
                    className="rounded border-gray-300 text-[#f4b941] focus:ring-[#f4b941]"
                  />
                  <span className="ml-2 text-sm text-gray-700">I&apos;m open to collaboration requests</span>
                </label>
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="w-full bg-[#f4b941] text-[#100359] py-2 rounded-md font-bold hover:bg-[#f4b941]/90"
          >
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  )
}
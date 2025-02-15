'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FormField } from '@/components/FormField'

const INDUSTRY_OPTIONS = [
  { value: '', label: 'Select Industry' },
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'finance', label: 'Finance' },
  { value: 'other', label: 'Other' }
]

const ROLE_OPTIONS = [
  { value: '', label: 'Select Role' },
  { value: 'developer', label: 'Developer' },
  { value: 'entrepreneur', label: 'Entrepreneur' },
  { value: 'business_owner', label: 'Business Owner' },
  { value: 'other', label: 'Other' }
]

const INTERESTS_OPTIONS = [
  { value: 'ai', label: 'Artificial Intelligence' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'finance', label: 'Finance' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'productivity', label: 'Productivity' }
]

const GOALS_OPTIONS = [
  { value: 'find_solutions', label: 'Find SaaS Solutions' },
  { value: 'develop_ideas', label: 'Develop Ideas' },
  { value: 'collaborate', label: 'Find Collaborators' },
  { value: 'market_research', label: 'Market Research' },
  { value: 'networking', label: 'Professional Networking' }
]

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'connections', label: 'Connections Only' }
]

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
              <FormField
                label="Full Name"
                id="fullName"
                value={formData.fullName}
                onChange={(value) => setFormData({ ...formData, fullName: value })}
                placeholder="Enter your full name"
                required
              />
              
              <FormField
                label="Bio"
                id="bio"
                type="textarea"
                value={formData.bio}
                onChange={(value) => setFormData({ ...formData, bio: value })}
                placeholder="Tell us about yourself"
                required
              />
            </div>
          </section>

          {/* Professional Background Section */}
          <section>
            <h2 className="text-xl font-semibold text-[#100359] mb-4">Professional Background</h2>
            <div className="space-y-4">
              <FormField
                label="Industry"
                id="industry"
                type="select"
                value={formData.industry}
                onChange={(value) => setFormData({ ...formData, industry: value })}
                options={INDUSTRY_OPTIONS}
                required
              />

              <FormField
                label="Role"
                id="role"
                type="select"
                value={formData.role}
                onChange={(value) => setFormData({ ...formData, role: value })}
                options={ROLE_OPTIONS}
                required
              />
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
              <FormField
                label="Select Your Interests"
                id="interests"
                type="select"
                value={formData.interests}
                onChange={(values) => setFormData({ ...formData, interests: values })}
                options={INTERESTS_OPTIONS}
                multiple
                size={6}
              />
            </div>
          </section>

          {/* Goals */}
          <section>
            <h2 className="text-xl font-semibold text-[#100359] mb-4">Goals</h2>
            <div className="space-y-4">
              <FormField
                label="What do you want to achieve?"
                id="goals"
                type="select"
                value={formData.goals}
                onChange={(values) => setFormData({ ...formData, goals: values })}
                options={GOALS_OPTIONS}
                multiple
                size={5}
              />
            </div>
          </section>

          {/* Privacy Settings */}
          <section>
            <h2 className="text-xl font-semibold text-[#100359] mb-4">Privacy Settings</h2>
            <div className="space-y-4">
              <FormField
                label="Profile Visibility"
                id="profileVisibility"
                type="select"
                value={formData.profileVisibility}
                onChange={(value) => setFormData({ ...formData, profileVisibility: value })}
                options={VISIBILITY_OPTIONS}
              />
              
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

          <section>
            <h2 className="text-xl font-semibold text-[#100359] mb-4">User Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">User Type</label>
                <select
                  id="userType"
                  name="userType"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  aria-label="Select user type"
                  title="User type"
                >
                  {/* options */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  aria-label="First name"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  aria-label="Last name"
                  placeholder="Enter your last name"
                />
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
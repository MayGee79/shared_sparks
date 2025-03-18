'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { FormField } from '@/components/FormField'

const INDUSTRY_OPTIONS = [
  { value: '', label: 'Select Industry' },
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'finance', label: 'Finance' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail' },
  { value: 'other', label: 'Other' }
]

const ROLE_OPTIONS = [
  { value: '', label: 'Select Role' },
  { value: 'developer', label: 'Developer' },
  { value: 'entrepreneur', label: 'Entrepreneur' },
  { value: 'business_owner', label: 'Business Owner' },
  { value: 'product_manager', label: 'Product Manager' },
  { value: 'designer', label: 'Designer' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'other', label: 'Other' }
]

const INTERESTS_OPTIONS = [
  { value: 'ai', label: 'Artificial Intelligence' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'finance', label: 'Finance' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'sustainability', label: 'Sustainability' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'ar_vr', label: 'AR/VR' }
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

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  
  // Initial form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    industry: '',
    role: '',
    expertise: [] as string[],
    skills: [] as string[],
    interests: [] as string[],
    goals: [] as string[],
    twitter: '',
    linkedin: '',
    github: '',
    allowCollaboration: true,
    profileVisibility: 'public',
    notificationPrefs: {
      newVotes: true,
      newComments: true,
      saasMatches: true
    }
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated' && session?.user?.email) {
      // Fetch existing profile data
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data.hasCompletedOnboarding) {
            router.push('/dashboard')
            return
          }
          
          // Pre-fill form with any existing data
          if (data.profile) {
            setFormData(prev => ({
              ...prev,
              ...data.profile
            }))
          }
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Error fetching profile:', error)
          setIsLoading(false)
        })
    }
  }, [status, session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/user/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Failed to update profile')
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Profile update failed:', error)
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-blue-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Loading...</h2>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-blue-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">
            Please log in to continue onboarding.
          </h2>
          <a 
            href="/auth/signin"
            className="inline-block px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/logo.png" 
            alt="Shared Sparks" 
            className="h-44 w-auto"
          />
          <h1 className="text-3xl font-bold text-indigo-900 mt-6">
            Complete Your Profile
          </h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Basic Info Section */}
            <section>
              <h2 className="text-xl font-semibold text-indigo-900 mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(value) => setFormData({ ...formData, firstName: value })}
                    placeholder="Enter your first name"
                    required
                  />
                  
                  <FormField
                    label="Last Name"
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(value) => setFormData({ ...formData, lastName: value })}
                    placeholder="Enter your last name"
                    required
                  />
                </div>

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
              <h2 className="text-xl font-semibold text-indigo-900 mb-4">
                Professional Background
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </section>

            {/* Interests & Goals Section */}
            <section>
              <h2 className="text-xl font-semibold text-indigo-900 mb-4">
                Interests & Goals
              </h2>
              <div className="space-y-4">
                <FormField
                  label="Select Your Interests"
                  id="interests"
                  type="select"
                  value={formData.interests}
                  onChange={(values) => setFormData({ ...formData, interests: values })}
                  options={INTERESTS_OPTIONS}
                  multiple
                  size={5}
                />
                
                <FormField
                  label="Your Goals on the Platform"
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

            {/* Social Media Links */}
            <section>
              <h2 className="text-xl font-semibold text-indigo-900 mb-4">
                Social Media Links
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
            </section>

            {/* Privacy Settings */}
            <section>
              <h2 className="text-xl font-semibold text-indigo-900 mb-4">
                Privacy Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowCollaboration"
                    checked={formData.allowCollaboration}
                    onChange={(e) => setFormData({ ...formData, allowCollaboration: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allowCollaboration" className="ml-2 block text-sm text-gray-700">
                    Allow other users to send me collaboration requests
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Visibility
                  </label>
                  <select
                    value={formData.profileVisibility}
                    onChange={(e) => setFormData({ ...formData, profileVisibility: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {VISIBILITY_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 disabled:opacity-75"
              >
                {isLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
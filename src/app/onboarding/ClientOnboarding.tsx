'use client'

import { FormField } from '@/components/FormField'

const INDUSTRY_OPTIONS = [
  { value: '', label: 'Select Industry' },
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'finance', label: 'Finance' },
  { value: 'other', label: 'Other' }
]

export default function ClientOnboarding() {
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
        <p className="mb-6 text-gray-600">
          Please provide some information to get started. This will help us customize your experience.
        </p>
        
        <form>
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  id="firstName"
                  value=""
                  onChange={(value) => console.log(value)}
                  placeholder="Enter your first name"
                  required
                />
                <FormField
                  label="Last Name"
                  id="lastName"
                  value=""
                  onChange={(value) => console.log(value)}
                  placeholder="Enter your last name"
                  required
                />
              </div>
              <div className="mt-4">
                <FormField
                  label="Bio"
                  id="bio"
                  type="textarea"
                  value=""
                  onChange={(value) => console.log(value)}
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Save Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 
'use client'

// Note: Using standard HTML img tags instead of Next.js Image components
// due to type compatibility issues in Next.js 14.2.24 with server components.
// TODO: Revisit when upgrading Next.js or when the issue is resolved.

export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FormField } from '@/components/FormField'
import { default as nextDynamic } from 'next/dynamic'

const AuthComponent = nextDynamic(
  () => import('@/app/components/AuthComponent'),
  { ssr: false } // Disable server-side rendering
)

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
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Initial form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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

  // Use effect to simulate authentication check
  useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      // For demo purposes, setting isAuthenticated to false
      setIsAuthenticated(false);
      
      // Populate form with sample data (in a real app, this would be from the session)
      setFormData(prevData => ({
        ...prevData,
        firstName: 'John',
        lastName: 'Doe',
      }));
      
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // In a real app, this would send data to your API
      console.log('Submitting form data:', formData);
      
      // Simulate successful submission
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (error) {
      console.error('Profile update failed:', error)
    }
  }

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'rgba(85, 183, 255, 0.1)',
        padding: '2rem', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Loading...</h2>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'rgba(85, 183, 255, 0.1)',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Please log in to continue onboarding.
          </h2>
          <a 
            href="/auth/signin" 
            style={{ 
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: '#4299e1',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.25rem',
              fontWeight: 'bold'
            }}
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'rgba(85, 183, 255, 0.1)',
      padding: '2rem'
    }}>
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        backgroundColor: 'white', 
        borderRadius: '0.5rem', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        padding: '2rem'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          marginBottom: '2rem'
        }}>
          <img 
            src="/logo.png" 
            alt="Shared Sparks" 
            width={176}
            height={176}
            style={{ height: '11rem', width: 'auto' }}
          />
          <h2 style={{ 
            marginTop: '1.5rem', 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            color: '#100359' 
          }}>
            Complete Your Profile
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          {/* Basic Info Section */}
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#100359', 
              marginBottom: '1rem' 
            }}>
              Basic Information
            </h2>
            <div style={{ marginBottom: '1rem' }}>
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
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#100359', 
              marginBottom: '1rem' 
            }}>
              Professional Background
            </h2>
            <div style={{ marginBottom: '1rem' }}>
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
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#100359', 
              marginBottom: '1rem' 
            }}>
              Social Media Links
            </h2>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#4b5563', 
                  marginBottom: '0.25rem' 
                }}>
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  style={{ 
                    marginTop: '0.25rem', 
                    display: 'block', 
                    width: '100%', 
                    borderRadius: '0.375rem', 
                    border: '1px solid #d1d5db', 
                    padding: '0.5rem 0.75rem' 
                  }}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#4b5563', 
                  marginBottom: '0.25rem' 
                }}>
                  GitHub
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  style={{ 
                    marginTop: '0.25rem', 
                    display: 'block', 
                    width: '100%', 
                    borderRadius: '0.375rem', 
                    border: '1px solid #d1d5db', 
                    padding: '0.5rem 0.75rem' 
                  }}
                  placeholder="https://github.com/username"
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#4b5563', 
                  marginBottom: '0.25rem' 
                }}>
                  Twitter
                </label>
                <input
                  type="url"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  style={{ 
                    marginTop: '0.25rem', 
                    display: 'block', 
                    width: '100%', 
                    borderRadius: '0.375rem', 
                    border: '1px solid #d1d5db', 
                    padding: '0.5rem 0.75rem' 
                  }}
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>
          </section>

          {/* Interest Tags */}
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#100359', 
              marginBottom: '1rem' 
            }}>
              Interests
            </h2>
            <div style={{ marginBottom: '1rem' }}>
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

          {/* Submit Button */}
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#4299e1',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
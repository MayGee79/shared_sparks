'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface SaaSDetail {
  id: string
  name: string
  description: string
  website: string
  logo: string | null
  category: string
  pricingModel: string
  pricingDetails: string | null
  tags: string[]
  features: string[]
  integrations: string[]
  pros: string[]
  cons: string[]
  averageRating: number | null
  verified: boolean
  createdAt: string
  submitter: {
    username: string | null
    image: string | null
  } | null
}

export default function SaaSDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [saas, setSaas] = useState<SaaSDetail | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    const fetchSaaSDetail = async () => {
      try {
        const response = await fetch(`/api/saas/${id}`)
        
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'SaaS product not found' : 'Failed to fetch SaaS details')
        }
        
        const data = await response.json()
        setSaas(data.saas)
      } catch (err) {
        console.error('Error fetching SaaS details:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    const fetchFavoriteStatus = async () => {
      if (!session?.user) return
      
      try {
        const response = await fetch(`/api/saas/favorite?saasId=${id}`)
        if (response.ok) {
          const data = await response.json()
          setIsFavorited(data.favorited)
        }
      } catch (err) {
        console.error('Error fetching favorite status:', err)
      }
    }
    
    fetchSaaSDetail()
    fetchFavoriteStatus()
  }, [id, session])

  const toggleFavorite = async () => {
    if (!session?.user) {
      router.push('/auth/login')
      return
    }
    
    try {
      const response = await fetch('/api/saas/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ saasId: id })
      })
      
      if (response.ok) {
        const data = await response.json()
        setIsFavorited(data.favorited)
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !saas) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'SaaS not found'}
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the SaaS product you're looking for. It may have been removed or the link might be incorrect.
          </p>
          <button
            onClick={() => router.push('/saas')}
            className="bg-primary text-white font-bold py-2 px-6 rounded hover:bg-primary/90"
          >
            Back to SaaS Directory
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/saas')}
              className="flex items-center text-white hover:underline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Directory
            </button>
            <button
              onClick={toggleFavorite}
              className="flex items-center bg-accent/80 hover:bg-accent text-primary px-4 py-2 rounded-full font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill={isFavorited ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isFavorited ? "0" : "2"}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {isFavorited ? 'Favorited' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-start">
            {/* Logo */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center mr-0 md:mr-8 mb-6 md:mb-0">
              {saas.logo ? (
                <img 
                  src={saas.logo} 
                  alt={`${saas.name} logo`} 
                  className="w-full h-full object-contain p-2" 
                />
              ) : (
                <div className="text-gray-400 text-lg">No logo</div>
              )}
            </div>
            
            {/* Basic Info */}
            <div className="flex-grow">
              <div className="flex flex-wrap items-center mb-2">
                <h1 className="text-3xl font-bold mr-3">{saas.name}</h1>
                {saas.verified && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              
              <div className="mb-4">
                <a 
                  href={saas.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {saas.website}
                </a>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {saas.category}
                </span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {saas.pricingModel}
                </span>
              </div>
              
              <p className="text-gray-700 text-lg mb-4">
                {saas.description}
              </p>
              
              {saas.pricingDetails && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Pricing Details</h3>
                  <p className="text-gray-700 p-3 bg-gray-50 rounded">
                    {saas.pricingDetails}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Tags */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {saas.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {/* Features */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">Key Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {saas.features.map(feature => (
                <li key={feature} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Pros & Cons */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-700">Pros</h3>
              <ul className="space-y-2">
                {saas.pros.map(pro => (
                  <li key={pro} className="flex items-start bg-green-50 p-3 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-700">Cons</h3>
              <ul className="space-y-2">
                {saas.cons.map(con => (
                  <li key={con} className="flex items-start bg-red-50 p-3 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Integrations */}
          {saas.integrations && saas.integrations.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Integrations</h3>
              <div className="flex flex-wrap gap-2">
                {saas.integrations.map(integration => (
                  <span key={integration} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {integration}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Submission Info */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>
              Added on {new Date(saas.createdAt).toLocaleDateString()}
              {saas.submitter?.username && ` by ${saas.submitter.username}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
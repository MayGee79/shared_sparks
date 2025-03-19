'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

interface SaaSItem {
  id: string
  name: string
  description: string
  logo: string | null
  website: string
  category: string
  pricingModel: string
  tags: string[]
  features: string[]
  averageRating: number | null
  createdAt: string
  favoritedAt: string
}

export default function FavoriteSaaSPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [favorites, setFavorites] = useState<SaaSItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchFavorites()
    }
  }, [status])

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/saas/favorites')
      
      if (!response.ok) {
        throw new Error('Failed to fetch favorites')
      }
      
      const data = await response.json()
      setFavorites(data.favorites)
    } catch (err) {
      console.error('Error fetching favorites:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (saasId: string) => {
    try {
      const response = await fetch('/api/saas/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ saasId })
      })
      
      if (response.ok) {
        // Remove from UI without refetching
        setFavorites(prev => prev.filter(item => item.id !== saasId))
      }
    } catch (err) {
      console.error('Error removing favorite:', err)
    }
  }

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">My Favorite SaaS Tools</h1>
          <button
            onClick={() => router.push('/saas')}
            className="bg-accent text-primary px-4 py-2 rounded-md font-medium hover:bg-accent/90 transition-colors"
          >
            Explore More SaaS
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {favorites.length === 0 && !loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't added any SaaS tools to your favorites list yet.
            </p>
            <button
              onClick={() => router.push('/saas')}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Browse SaaS Directory
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(saas => (
              <motion.div
                key={saas.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center mr-4">
                        {saas.logo ? (
                          <img 
                            src={saas.logo} 
                            alt={`${saas.name} logo`} 
                            className="w-8 h-8 object-contain" 
                          />
                        ) : (
                          <div className="text-gray-400 text-xs">{saas.name.substring(0, 2).toUpperCase()}</div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{saas.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {saas.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveFavorite(saas.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove from favorites"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {saas.description}
                  </p>
                  
                  {saas.tags && saas.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {saas.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {saas.tags.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{saas.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <a
                      href={saas.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visit Website
                    </a>
                    <button
                      onClick={() => router.push(`/saas/${saas.id}`)}
                      className="text-primary hover:text-primary/80 text-sm"
                    >
                      Details →
                    </button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                    Favorited on {new Date(saas.favoritedAt).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  averageRating: number | null
  createdAt: string
}

export default function SaaSDirectoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get filters from URL
  const initialCategory = searchParams.get('category') || ''
  const initialSearch = searchParams.get('search') || ''
  const initialTag = searchParams.get('tag') || ''
  const initialPage = parseInt(searchParams.get('page') || '1')
  
  // State
  const [saasItems, setSaasItems] = useState<SaaSItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  
  // Filter state
  const [category, setCategory] = useState(initialCategory)
  const [tag, setTag] = useState(initialTag)
  const [search, setSearch] = useState(initialSearch)
  
  const itemsPerPage = 9 // Items per page

  // Fetch SaaS data
  useEffect(() => {
    const fetchSaaS = async () => {
      setLoading(true)
      try {
        let url = `/api/saas?page=${currentPage}&limit=${itemsPerPage}`
        
        if (category) url += `&category=${encodeURIComponent(category)}`
        if (tag) url += `&tag=${encodeURIComponent(tag)}`
        if (search) url += `&search=${encodeURIComponent(search)}`
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error('Failed to fetch SaaS products')
        }
        
        const data = await response.json()
        setSaasItems(data.saas)
        setTotalItems(data.totalCount)
        setPageCount(data.pageCount)
        setCategories(data.categories || [])
        setTags(data.tags || [])
      } catch (err) {
        console.error('Error fetching SaaS data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    fetchSaaS()
    
    // Update URL with filters
    const params = new URLSearchParams()
    if (currentPage > 1) params.set('page', currentPage.toString())
    if (category) params.set('category', category)
    if (tag) params.set('tag', tag)
    if (search) params.set('search', search)
    
    const queryString = params.toString()
    const newUrl = queryString ? `/saas?${queryString}` : `/saas`
    router.push(newUrl, { scroll: false })
    
  }, [currentPage, category, tag, search])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on new search
  }
  
  // Handle filter changes
  const handleCategoryChange = (newCategory: string) => {
    setCategory(category === newCategory ? '' : newCategory)
    setCurrentPage(1)
  }
  
  const handleTagChange = (newTag: string) => {
    setTag(tag === newTag ? '' : newTag)
    setCurrentPage(1)
  }
  
  // Clear all filters
  const clearFilters = () => {
    setCategory('')
    setTag('')
    setSearch('')
    setCurrentPage(1)
  }
  
  // Handle pagination
  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  // Loading UI
  if (loading && saasItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">SaaS Directory</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Discover and compare the best SaaS tools to power your business and streamline your workflow.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Search and filter section */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search SaaS products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
            {(category || tag || search) && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </form>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      category === cat
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 10).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTagChange(t)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      tag === t
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Active filters */}
        {(category || tag) && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Active filters:</span>
            {category && (
              <span 
                className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-md flex items-center"
              >
                Category: {category}
                <button 
                  onClick={() => setCategory('')}
                  className="ml-1 text-primary hover:text-primary/80"
                >
                  ✕
                </button>
              </span>
            )}
            {tag && (
              <span 
                className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-md flex items-center"
              >
                Tag: {tag}
                <button 
                  onClick={() => setTag('')}
                  className="ml-1 text-primary hover:text-primary/80"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        )}
        
        {/* Results count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500">
            {totalItems === 0 ? (
              'No SaaS products found'
            ) : (
              `Showing ${(currentPage - 1) * itemsPerPage + 1}-${
                Math.min(currentPage * itemsPerPage, totalItems)
              } of ${totalItems} SaaS products`
            )}
          </p>
          
          {/* Add SaaS link */}
          <button
            onClick={() => router.push('/saas/submit')}
            className="px-4 py-2 bg-accent text-primary rounded-md hover:bg-accent/90 transition-colors text-sm font-medium"
          >
            + Add SaaS Product
          </button>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* SaaS grid */}
        {saasItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saasItems.map((saas) => (
              <motion.div
                key={saas.id}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start mb-4">
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
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {saas.pricingModel}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {saas.description}
                  </p>
                  
                  {saas.tags && saas.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {saas.tags.slice(0, 3).map((tag) => (
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
                      View Details →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : !loading ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">No SaaS products found</h3>
            <p className="text-gray-600 mb-6">
              {search || category || tag
                ? "Try adjusting your filters or search terms"
                : "There are no SaaS products available yet"}
            </p>
            <button
              onClick={() => router.push('/saas/submit')}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Submit a SaaS Product
            </button>
          </div>
        ) : null}
        
        {/* Pagination */}
        {pageCount > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                // Calculate page numbers to show
                let pageNum = i + 1;
                if (pageCount > 5) {
                  if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pageCount - 2) {
                    pageNum = pageCount - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => goToPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === pageNum
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => goToPage(Math.min(pageCount, currentPage + 1))}
                disabled={currentPage === pageCount}
                className={`px-3 py-1 rounded-md ${
                  currentPage === pageCount
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
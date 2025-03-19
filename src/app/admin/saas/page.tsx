'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

interface SaaSItem {
  id: string
  name: string
  description: string
  website: string
  category: string
  pricingModel: string
  tags: string[]
  averageRating: number | null
  verified: boolean
  createdAt: string
  submitter: {
    username: string | null
  } | null
}

export default function SaaSManagement() {
  const { status } = useSession()
  const router = useRouter()
  
  const [saasItems, setSaasItems] = useState<SaaSItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [processing, setProcessing] = useState<string | null>(null)
  
  const itemsPerPage = 10

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (status === 'unauthenticated') {
      router.push('/admin-login')
      return
    }

    if (status === 'authenticated') {
      fetchSaaSItems()
    }
  }, [status, router, currentPage, categoryFilter])

  const fetchSaaSItems = async () => {
    try {
      setLoading(true)
      
      let url = `/api/admin/saas?page=${currentPage}&limit=${itemsPerPage}`
      if (categoryFilter) url += `&category=${encodeURIComponent(categoryFilter)}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch SaaS items')
      }
      
      const data = await response.json()
      setSaasItems(data.items)
      setTotalItems(data.total)
      setCategories(data.categories || [])
    } catch (err) {
      console.error('Error fetching SaaS items:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchSaaSItems()
  }

  const handleViewDetails = (id: string) => {
    router.push(`/admin/saas/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/saas/${id}/edit`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this SaaS? This action cannot be undone.')) {
      return
    }
    
    try {
      setProcessing(id)
      const response = await fetch(`/api/admin/saas/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete SaaS')
      }
      
      // Remove from the list
      setSaasItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error('Error deleting SaaS:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setProcessing(null)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleCategoryChange = (category: string | null) => {
    setCategoryFilter(category)
    setCurrentPage(1)
  }

  if (status === 'loading' || loading && saasItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="SaaS Management" />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800">SaaS Products</h1>
              <button
                onClick={() => router.push('/admin/saas/create')}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Add New SaaS
              </button>
            </div>
            
            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-md shadow-sm mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <form onSubmit={handleSearch} className="flex mb-4 md:mb-0">
                  <input
                    type="text"
                    placeholder="Search SaaS..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border rounded-l px-4 py-2 w-full md:w-64"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded-r hover:bg-primary/90"
                  >
                    Search
                  </button>
                </form>
                
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Category:</span>
                  <select
                    value={categoryFilter || ''}
                    onChange={(e) => handleCategoryChange(e.target.value || null)}
                    className="border rounded px-4 py-2"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p>{error}</p>
              </div>
            )}
            
            {/* SaaS Table */}
            {saasItems.length === 0 && !loading ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No SaaS products found</h3>
                <p className="text-gray-600 mb-6">
                  {search || categoryFilter
                    ? "No SaaS products match your search criteria. Try adjusting your filters."
                    : "There are no SaaS products in the system yet."}
                </p>
                <button
                  onClick={() => router.push('/admin/saas/create')}
                  className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
                >
                  Add New SaaS
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {saasItems.map((saas) => (
                      <tr key={saas.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {saas.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{saas.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            saas.verified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {saas.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {saas.averageRating ? `${saas.averageRating.toFixed(1)} / 5` : 'No ratings'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(saas.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(saas.id)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(saas.id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(saas.id)}
                            disabled={processing === saas.id}
                            className={`text-red-600 hover:text-red-900 ${
                              processing === saas.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {processing === saas.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            {totalItems > itemsPerPage && (
              <div className="flex justify-center mt-6">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: Math.ceil(totalItems / itemsPerPage) }).map((_, idx) => {
                    const pageNumber = idx + 1
                    // Show only a limited number of page buttons
                    if (
                      pageNumber === 1 ||
                      pageNumber === Math.ceil(totalItems / itemsPerPage) ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === pageNumber
                              ? 'z-10 bg-primary text-white'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    } else if (
                      pageNumber === 2 ||
                      pageNumber === Math.ceil(totalItems / itemsPerPage) - 1
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      )
                    }
                    
                    return null
                  })}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(Math.ceil(totalItems / itemsPerPage), currentPage + 1))}
                    disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === Math.ceil(totalItems / itemsPerPage)
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 
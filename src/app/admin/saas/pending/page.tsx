'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

interface SaaSSubmission {
  id: string
  name: string
  description: string
  website: string
  category: string
  pricingModel: string
  submitter: {
    username: string | null
    image: string | null
  } | null
  createdAt: string
}

export default function PendingSaaSReviews() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [submissions, setSubmissions] = useState<SaaSSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (status === 'unauthenticated') {
      router.push('/admin-login')
      return
    }

    if (status === 'authenticated') {
      fetchPendingSubmissions()
    }
  }, [status, router])

  const fetchPendingSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/saas/pending')
      
      if (!response.ok) {
        throw new Error('Failed to fetch pending submissions')
      }
      
      const data = await response.json()
      setSubmissions(data.submissions)
    } catch (err) {
      console.error('Error fetching pending submissions:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id)
      const response = await fetch('/api/admin/saas/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, action: 'approve' })
      })
      
      if (!response.ok) {
        throw new Error('Failed to approve submission')
      }
      
      // Remove from the list
      setSubmissions(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error('Error approving submission:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: string) => {
    try {
      setProcessingId(id)
      const response = await fetch('/api/admin/saas/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, action: 'reject' })
      })
      
      if (!response.ok) {
        throw new Error('Failed to reject submission')
      }
      
      // Remove from the list
      setSubmissions(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      console.error('Error rejecting submission:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setProcessingId(null)
    }
  }

  const handleView = (id: string) => {
    router.push(`/admin/saas/${id}`)
  }

  if (status === 'loading' || loading) {
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
        <AdminHeader title="Pending SaaS Submissions" />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800">Pending SaaS Submissions</h1>
              <button
                onClick={() => fetchPendingSubmissions()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Refresh
              </button>
            </div>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p>{error}</p>
              </div>
            )}
            
            {submissions.length === 0 && !loading ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No pending submissions</h3>
                <p className="text-gray-600 mb-6">
                  There are no SaaS submissions waiting for review at this time.
                </p>
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
                        Pricing Model
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted By
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted On
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {submission.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{submission.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{submission.pricingModel}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              {submission.submitter?.image ? (
                                <img
                                  src={submission.submitter.image}
                                  alt=""
                                  className="h-8 w-8 rounded-full"
                                />
                              ) : (
                                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                              )}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {submission.submitter?.username || 'Anonymous'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleView(submission.id)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleApprove(submission.id)}
                            disabled={processingId === submission.id}
                            className={`text-green-600 hover:text-green-900 mr-4 ${
                              processingId === submission.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {processingId === submission.id ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(submission.id)}
                            disabled={processingId === submission.id}
                            className={`text-red-600 hover:text-red-900 ${
                              processingId === submission.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {processingId === submission.id ? 'Processing...' : 'Reject'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 
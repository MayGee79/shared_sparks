'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Check, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Star, 
  Users, 
  Clock 
} from 'lucide-react'

type Review = {
  id: string
  content: string
  rating: number
  createdAt: string
  user: {
    username: string
    image: string | null
  }
}

type SaaSDetails = {
  id: string
  name: string
  description: string
  website: string
  category: string
  pricingModel: string
  pricingDetails: string | null
  tags: string[]
  features: string[]
  integrations: string[]
  pros: string[]
  cons: string[]
  logo: string | null
  averageRating: number | null
  verified: boolean
  createdAt: string
  submitter: {
    id: string
    name: string | null
    email: string
    username: string
    image: string | null
  }
  reviews: Review[]
  favoriteCount: number
}

export default function SaaSDetails() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const [saas, setSaas] = useState<SaaSDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/admin-login')
      return
    }

    // Fetch SaaS details
    if (status === 'authenticated' && params.id) {
      fetchSaaSDetails(params.id as string)
    }
  }, [status, params.id, router])

  const fetchSaaSDetails = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/saas/${id}`)
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/admin-login')
          return
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setSaas(data.saas)
    } catch (err) {
      console.error('Failed to fetch SaaS details:', err)
      setError('Failed to load SaaS details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    // Confirm before deletion
    if (!window.confirm(`Are you sure you want to delete "${saas?.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/admin/saas/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      router.push('/admin/saas')
    } catch (err) {
      console.error('Failed to delete SaaS:', err)
      setError('Failed to delete SaaS. Please try again.')
      setIsDeleting(false)
    }
  }

  const handleEdit = () => {
    router.push(`/admin/saas/${params.id}/edit`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold">Loading SaaS details...</h1>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-6xl py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      </div>
    )
  }

  if (!saas) {
    return (
      <div className="container max-w-6xl py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="bg-amber-50 text-amber-600 p-4 rounded-md">
          SaaS not found.
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to SaaS List
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {saas.logo ? (
                    <Image 
                      src={saas.logo} 
                      alt={`${saas.name} logo`}
                      width={48}
                      height={48}
                      className="rounded-md object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                      {saas.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-2xl">{saas.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={saas.verified ? "default" : "outline"}>
                        {saas.verified ? (
                          <>
                            <Check className="mr-1 h-3 w-3" />
                            Verified
                          </>
                        ) : (
                          'Pending'
                        )}
                      </Badge>
                      <Badge variant="outline">{saas.category}</Badge>
                      <Badge variant="outline">{saas.pricingModel}</Badge>
                    </div>
                  </div>
                </div>
                <a 
                  href={saas.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:underline"
                >
                  Visit Website
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="features">Features & Integrations</TabsTrigger>
                  <TabsTrigger value="reviews">
                    Reviews ({saas.reviews.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Description</h3>
                      <p className="text-gray-700">{saas.description}</p>
                    </div>
                    
                    {saas.pricingDetails && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Pricing Details</h3>
                        <p className="text-gray-700">{saas.pricingDetails}</p>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {saas.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Pros</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {saas.pros.map((pro, index) => (
                            <li key={index}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Cons</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {saas.cons.map((con, index) => (
                            <li key={index}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="features">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Features</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {saas.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Integrations</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {saas.integrations.length > 0 ? (
                          saas.integrations.map((integration, index) => (
                            <li key={index}>{integration}</li>
                          ))
                        ) : (
                          <li>No integrations specified</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews">
                  {saas.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {saas.reviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="pt-4">
                            <div className="flex justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {review.user.image ? (
                                  <Image 
                                    src={review.user.image} 
                                    alt={review.user.username} 
                                    width={24} 
                                    height={24} 
                                    className="rounded-full"
                                  />
                                ) : (
                                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                                    {review.user.username.charAt(0)}
                                  </div>
                                )}
                                <span className="font-medium">{review.user.username}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-2">
                                  {formatDate(review.createdAt)}
                                </span>
                                <div className="flex items-center text-amber-500">
                                  <Star className="h-4 w-4 fill-current" />
                                  <span className="ml-1">{review.rating.toFixed(1)}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700">{review.content}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No reviews for this SaaS yet.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Submitted by</h3>
                  <div className="flex items-center mt-1 gap-2">
                    {saas.submitter.image ? (
                      <Image 
                        src={saas.submitter.image} 
                        alt={saas.submitter.username} 
                        width={24} 
                        height={24} 
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                        {saas.submitter.username.charAt(0)}
                      </div>
                    )}
                    <span>{saas.submitter.username}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{saas.submitter.email}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date Added</h3>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{formatDate(saas.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <div className="mt-1">
                      <Badge variant={saas.verified ? "success" : "warning"}>
                        {saas.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Reviews</h3>
                    <div className="flex items-center mt-1">
                      <Star className={`h-4 w-4 ${saas.averageRating ? 'text-amber-500' : 'text-gray-400'} mr-1`} />
                      <span>
                        {saas.averageRating 
                          ? `${saas.averageRating.toFixed(1)} (${saas.reviews.length})` 
                          : 'No reviews'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Favorites</h3>
                    <div className="flex items-center mt-1">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{saas.favoriteCount}</span>
                    </div>
                  </div>
                </div>
                
                {!saas.verified && (
                  <>
                    <Separator />
                    <div className="pt-2">
                      <Button 
                        className="w-full" 
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/admin/saas/review', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                id: saas.id,
                                action: 'approve'
                              }),
                            })
                            
                            if (response.ok) {
                              // Refresh the data
                              fetchSaaSDetails(saas.id)
                            } else {
                              throw new Error('Failed to approve')
                            }
                          } catch (err) {
                            console.error('Error approving SaaS:', err)
                            setError('Failed to approve SaaS')
                          }
                        }}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Approve Submission
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
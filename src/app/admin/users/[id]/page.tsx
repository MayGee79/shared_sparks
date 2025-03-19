'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { 
  ArrowLeft, 
  Edit, 
  Trash, 
  UserX,
  UserPlus,
  Mail,
  Loader2,
  Calendar,
  Database,
  Star,
  Heart,
  Activity
} from 'lucide-react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

type User = {
  id: string
  name: string | null
  email: string
  username: string | null
  image: string | null
  userType: 'USER' | 'ADMIN'
  createdAt: string
}

type UserStats = {
  saasSubmissions: number
  reviews: number
  favorites: number
}

export default function UserDetailsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin-login')
      return
    }

    if (status === 'authenticated' && params.id) {
      fetchUserDetails()
    }
  }, [status, params.id, router])

  const fetchUserDetails = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/admin/users/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch user details')
      }
      
      const data = await response.json()
      setUser(data.user)
      setStats(data.stats)
    } catch (err) {
      console.error('Error fetching user details:', err)
      setError('Failed to load user details')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = () => {
    setIsDeleteDialogOpen(true)
  }
  
  const confirmDeleteUser = async () => {
    try {
      setIsProcessing(true)
      
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete user')
      }
      
      router.push('/admin/users')
    } catch (err) {
      console.error('Error deleting user:', err)
      setError('Failed to delete user')
    } finally {
      setIsProcessing(false)
      setIsDeleteDialogOpen(false)
    }
  }
  
  const handleUpdateUserType = async (newType: 'USER' | 'ADMIN') => {
    try {
      setIsProcessing(true)
      
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userType: newType })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update user role')
      }
      
      // Update user in state
      setUser(prev => prev ? { ...prev, userType: newType } : null)
    } catch (err) {
      console.error('Error updating user role:', err)
      setError('Failed to update user role')
    } finally {
      setIsProcessing(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader title="User Details" />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="container mx-auto px-6 py-8">
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                <span className="ml-2 text-lg text-gray-700">Loading...</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader title="User Details" />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="container mx-auto px-6 py-8">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="bg-red-50 text-red-600 p-4 rounded-md">
                {error}
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader title="User Details" />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="container mx-auto px-6 py-8">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="bg-amber-50 text-amber-600 p-4 rounded-md">
                User not found
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="User Details" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="mr-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              {!isProcessing ? (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit User
                  </Button>
                  {user.userType === 'USER' ? (
                    <Button 
                      variant="outline"
                      onClick={() => handleUpdateUserType('ADMIN')}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Make Admin
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      onClick={() => handleUpdateUserType('USER')}
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Remove Admin
                    </Button>
                  )}
                  <Button 
                    variant="destructive"
                    onClick={handleDeleteUser}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete User
                  </Button>
                </div>
              ) : (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>User Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 mb-4">
                        {user.image ? (
                          <Image 
                            src={user.image} 
                            width={96} 
                            height={96} 
                            alt={user.name || user.username || user.email} 
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-600">
                            {(user.name?.charAt(0) || user.username?.charAt(0) || user.email.charAt(0)).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold">{user.name || user.username || 'Unnamed User'}</h2>
                      <p className="text-gray-500 text-sm">{user.email}</p>
                      <div className="mt-2">
                        <Badge variant={user.userType === 'ADMIN' ? 'default' : 'outline'}>
                          {user.userType === 'ADMIN' ? 'Administrator' : 'Regular User'}
                        </Badge>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Username</h3>
                        <p>{user.username || 'Not set'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span>{format(new Date(user.createdAt), 'PPP')}</span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.location.href = `mailto:${user.email}`}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-md">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-full mr-3">
                            <Database className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">SaaS Submissions</h3>
                            <p className="text-sm text-gray-500">Total tools added</p>
                          </div>
                        </div>
                        <span className="text-2xl font-semibold">{stats?.saasSubmissions || 0}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-amber-50 rounded-md">
                        <div className="flex items-center">
                          <div className="p-2 bg-amber-100 rounded-full mr-3">
                            <Star className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Reviews</h3>
                            <p className="text-sm text-gray-500">Total reviews left</p>
                          </div>
                        </div>
                        <span className="text-2xl font-semibold">{stats?.reviews || 0}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-md">
                        <div className="flex items-center">
                          <div className="p-2 bg-red-100 rounded-full mr-3">
                            <Heart className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Favorites</h3>
                            <p className="text-sm text-gray-500">Saved SaaS tools</p>
                          </div>
                        </div>
                        <span className="text-2xl font-semibold">{stats?.favorites || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Tabs defaultValue="submissions">
                  <TabsList className="mb-4">
                    <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="submissions">
                    <Card>
                      <CardHeader>
                        <CardTitle>SaaS Submissions</CardTitle>
                        <CardDescription>
                          SaaS tools submitted by this user
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {stats?.saasSubmissions ? (
                          <div className="text-center p-8 text-gray-600">
                            <Activity className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p>User submissions feature coming soon</p>
                          </div>
                        ) : (
                          <div className="text-center p-8 text-gray-600">
                            <p>This user hasn't submitted any SaaS tools yet</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="reviews">
                    <Card>
                      <CardHeader>
                        <CardTitle>User Reviews</CardTitle>
                        <CardDescription>
                          Reviews left by this user
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {stats?.reviews ? (
                          <div className="text-center p-8 text-gray-600">
                            <Activity className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p>User reviews feature coming soon</p>
                          </div>
                        ) : (
                          <div className="text-center p-8 text-gray-600">
                            <p>This user hasn't left any reviews yet</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="activity">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                          User's recent actions on the platform
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center p-8 text-gray-600">
                          <Activity className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                          <p>Activity tracking feature coming soon</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this user and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteUser}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 
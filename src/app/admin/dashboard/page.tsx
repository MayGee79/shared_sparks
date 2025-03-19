'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart, 
  Users, 
  Database, 
  Clock, 
  MessageCircle,
  PlusCircle,
  UserPlus,
  ClipboardCheck,
  Settings
} from 'lucide-react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSaas: 0,
    pendingApprovals: 0,
    totalRequests: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (status === 'unauthenticated') {
      router.push('/admin-login')
      return
    }

    if (status === 'authenticated') {
      fetchStats()
    }
  }, [status, router])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/dashboard')
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      
      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
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
        <AdminHeader title="Dashboard" />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p>{error}</p>
              </div>
            )}
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-1">
                  <Button 
                    onClick={() => router.push('/admin/users')}
                    variant="link" 
                    className="p-0 text-sm text-primary"
                  >
                    View Users →
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total SaaS Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">{stats.totalSaas}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <Database className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-1">
                  <Button 
                    onClick={() => router.push('/admin/saas')}
                    variant="link" 
                    className="p-0 text-sm text-primary"
                  >
                    Manage SaaS →
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-1">
                  <Button 
                    onClick={() => router.push('/admin/saas/pending')}
                    variant="link" 
                    className="p-0 text-sm text-primary"
                  >
                    Review Submissions →
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">{stats.totalRequests}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <MessageCircle className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-1">
                  <Button 
                    onClick={() => router.push('/admin/requests')}
                    variant="link" 
                    className="p-0 text-sm text-primary"
                  >
                    View Requests →
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Recent Activities and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-md">
                      <div className="ml-2">
                        <p className="text-sm font-medium">New SaaS submission: CRM Tool</p>
                        <p className="text-xs text-gray-500">2 hours ago by johndoe</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 border-l-4 border-green-500 bg-green-50 rounded-r-md">
                      <div className="ml-2">
                        <p className="text-sm font-medium">SaaS approved: Marketing Automation</p>
                        <p className="text-xs text-gray-500">Yesterday by admin</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-md">
                      <div className="ml-2">
                        <p className="text-sm font-medium">New user registered: jane_smith</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0">
                    View All Activities →
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={() => router.push('/admin/saas/create')}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-4 h-auto flex flex-col items-center justify-center gap-2"
                    >
                      <PlusCircle className="w-6 h-6 mb-1" />
                      <span>Add SaaS</span>
                    </Button>
                    
                    <Button 
                      onClick={() => router.push('/admin/users/create')}
                      className="bg-green-500 hover:bg-green-600 text-white p-4 h-auto flex flex-col items-center justify-center gap-2"
                    >
                      <UserPlus className="w-6 h-6 mb-1" />
                      <span>Add User</span>
                    </Button>
                    
                    <Button 
                      onClick={() => router.push('/admin/saas/pending')}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 h-auto flex flex-col items-center justify-center gap-2"
                    >
                      <ClipboardCheck className="w-6 h-6 mb-1" />
                      <span>Review SaaS</span>
                    </Button>
                    
                    <Button 
                      onClick={() => router.push('/admin/settings')}
                      className="bg-purple-500 hover:bg-purple-600 text-white p-4 h-auto flex flex-col items-center justify-center gap-2"
                    >
                      <Settings className="w-6 h-6 mb-1" />
                      <span>Settings</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Usage Analytics */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Analytics</CardTitle>
                  <CardDescription>Overview of platform activity over the past month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md border border-dashed border-gray-300">
                    <div className="text-center">
                      <BarChart className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Analytics visualization placeholder</p>
                      <p className="text-sm text-gray-400 mt-2">Connect your analytics provider in settings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
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
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  UserPlus, 
  Edit, 
  Trash, 
  Eye,
  UserX,
  Mail,
  Loader2
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

export default function UserManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [userTypeFilter, setUserTypeFilter] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [processingUser, setProcessingUser] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin-login')
      return
    }

    if (status === 'authenticated') {
      fetchUsers()
    }
  }, [status, currentPage, searchQuery, userTypeFilter, router])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      // Build the query string
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchQuery && { search: searchQuery }),
        ...(userTypeFilter !== 'ALL' && { userType: userTypeFilter })
      })
      
      const response = await fetch(`/api/admin/users?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const data = await response.json()
      setUsers(data.users)
      setTotalPages(data.totalPages)
      setTotalUsers(data.totalUsers)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers()
  }
  
  const handleUserTypeChange = (value: string) => {
    setUserTypeFilter(value)
    setCurrentPage(1)
  }
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  
  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId)
    setIsDeleteDialogOpen(true)
  }
  
  const confirmDeleteUser = async () => {
    if (!userToDelete) return
    
    try {
      setProcessingUser(userToDelete)
      
      const response = await fetch(`/api/admin/users/${userToDelete}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete user')
      }
      
      setUsers(users.filter(user => user.id !== userToDelete))
      setTotalUsers(prev => prev - 1)
    } catch (err) {
      console.error('Error deleting user:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    } finally {
      setProcessingUser(null)
      setUserToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }
  
  const handleUpdateUserType = async (userId: string, newType: 'USER' | 'ADMIN') => {
    try {
      setProcessingUser(userId)
      
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userType: newType })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update user type')
      }
      
      // Update the user in the state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, userType: newType } : user
      ))
    } catch (err) {
      console.error('Error updating user type:', err)
      setError(err instanceof Error ? err.message : 'Failed to update user type')
    } finally {
      setProcessingUser(null)
    }
  }

  if (status === 'loading' || loading && users.length === 0) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader title="User Management" />
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

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="User Management" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-semibold text-gray-800">Users</h1>
                <p className="text-gray-600 mt-1">Manage user accounts in the system.</p>
              </div>
              
              <Button 
                onClick={() => router.push('/admin/users/create')}
                className="mt-4 md:mt-0"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p>{error}</p>
              </div>
            )}
            
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>User List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input 
                      placeholder="Search by name, email or username" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    <Button 
                      type="submit" 
                      className="absolute right-0 rounded-l-none"
                    >
                      Search
                    </Button>
                  </form>
                  
                  <div className="w-full md:w-48">
                    <Select 
                      value={userTypeFilter} 
                      onValueChange={handleUserTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Roles</SelectItem>
                        <SelectItem value="USER">Regular Users</SelectItem>
                        <SelectItem value="ADMIN">Administrators</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="hidden md:table-cell">Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                  {user.image ? (
                                    <Image 
                                      src={user.image} 
                                      width={32} 
                                      height={32} 
                                      alt={user.name || user.username || user.email} 
                                      className="object-cover"
                                    />
                                  ) : (
                                    <span className="text-sm font-medium text-gray-600">
                                      {(user.name?.charAt(0) || user.username?.charAt(0) || user.email.charAt(0)).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {user.name || user.username || 'Unnamed User'}
                                  </div>
                                  <div className="text-sm text-gray-500 md:hidden">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.userType === 'ADMIN' ? 'default' : 'outline'}>
                                {user.userType === 'ADMIN' ? 'Admin' : 'User'}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {user.email}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {format(new Date(user.createdAt), 'PP')}
                            </TableCell>
                            <TableCell className="text-right">
                              {processingUser === user.id ? (
                                <Loader2 className="h-5 w-5 animate-spin ml-auto" />
                              ) : (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}/edit`)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {user.userType === 'USER' ? (
                                      <DropdownMenuItem onClick={() => handleUpdateUserType(user.id, 'ADMIN')}>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Make Admin
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={() => handleUpdateUserType(user.id, 'USER')}>
                                        <UserX className="mr-2 h-4 w-4" />
                                        Remove Admin
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem>
                                      <Mail className="mr-2 h-4 w-4" />
                                      Send Email
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-red-600" 
                                      onClick={() => handleDeleteUser(user.id)}
                                    >
                                      <Trash className="mr-2 h-4 w-4" />
                                      Delete User
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No users found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {users.length} of {totalUsers} users
                  </div>
                  
                  {totalPages > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={page === currentPage}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              </CardContent>
            </Card>
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
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'

export default function AdminIndexPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    // Handle authentication and redirection
    if (status === 'unauthenticated') {
      router.push('/admin-login')
      return
    }

    if (status === 'authenticated') {
      // Check if user is admin, if not redirect to login
      if (session?.user?.role !== 'ADMIN') {
        router.push('/admin-login?error=unauthorized')
        return
      }
      
      // Redirect to dashboard
      router.push('/admin/dashboard')
    }
  }, [status, session, router])

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-semibold">Redirecting to Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Please wait...</p>
      </div>
    </div>
  )
} 
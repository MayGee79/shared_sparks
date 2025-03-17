'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardStaticFallback from './DashboardStaticFallback'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated' && session?.user) {
      // Check if user needs onboarding
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (!data.hasCompletedOnboarding) {
            router.push('/onboarding')
          }
        })
        .catch(error => {
          console.error('Error checking user profile:', error)
        })
    }
  }, [status, session, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return <DashboardStaticFallback />
}
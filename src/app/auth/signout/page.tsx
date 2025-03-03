'use client'

import { signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignoutPage() {
  const router = useRouter()

  useEffect(() => {
    signOut({ redirect: true, callbackUrl: '/' })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p>Signing out...</p>
    </div>
  )
}

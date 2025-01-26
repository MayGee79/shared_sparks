'use client'

import { signOut } from 'next-auth/react'
import { useEffect } from 'react'

export default function SignOut() {
  useEffect(() => {
    signOut({ callbackUrl: '/' })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">Signing out...</p>
    </div>
  )
}

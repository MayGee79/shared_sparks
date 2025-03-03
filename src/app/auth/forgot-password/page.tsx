'use client'

import { useState } from 'react'
import { LinkWrapper } from '@/components/LinkWrapper'
import { ImageWrapper } from '@/components/ImageWrapper'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Password reset logic will go here
    console.log('Password reset requested for:', email)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <ImageWrapper 
            src="/logo.png" 
            alt="Shared Sparks" 
            width={176}
            height={176}
            className="h-44 w-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-bold text-[#100359]">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <p className="text-gray-700 mb-6">
            Shared Sparks isn&apos;t just a platform; it&apos;s a partnership. Together, we can shape the future of SaaS 
            and redefine how the world solves its most pressing challenges.
          </p>
          <p className="mb-4">Don&apos;t forget your password!</p>
          
          {/* Use ImageWrapper instead of Image */}
          <ImageWrapper 
            src="/path/to/image.jpg" 
            alt="Description" 
            width={500} 
            height={500}
            className="w-full rounded-lg mb-6" 
          />

          {!submitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#55b7ff] focus:border-[#55b7ff] sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#55b7ff] hover:bg-[#6735b1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#55b7ff] transition-colors"
                >
                  Send reset link
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="text-sm text-gray-600">
                If an account exists for {email}, you will receive a password reset link in your email.
              </div>
              <LinkWrapper 
                href="/auth/login"
                className="mt-6 inline-block font-medium text-[#55b7ff] hover:text-[#f4b941]"
              >
                Return to login
              </LinkWrapper>
            </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <LinkWrapper 
                  href="/auth/login"
                  className="font-medium text-[#55b7ff] hover:text-[#f4b941]"
                >
                  Sign in
                </LinkWrapper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

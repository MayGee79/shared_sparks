'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

export default function LogoMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <div className="relative">
      {/* Logo as Menu Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 border-2 border-[#55b7ff] rounded-md hover:border-[#f4b941] hover:bg-[#f4b941]/10 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        <Image 
          src="/logo.png"
          alt="Shared Sparks"
          width={32}
          height={32}
          className="h-8 w-auto"
          priority
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-48 bg-[#100359] rounded-md shadow-lg z-50">
            <div className="py-1">
              <Link href="/" 
                    className="block px-4 py-3 text-[#f4b941] hover:bg-[#f4b941] hover:text-[#100359] transition-colors duration-200"
                    onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link href="/about" 
                    className="block px-4 py-3 text-[#f4b941] hover:bg-[#f4b941] hover:text-[#100359] transition-colors duration-200"
                    onClick={() => setIsOpen(false)}>
                About
              </Link>
              <Link href="/news" 
                    className="block px-4 py-3 text-[#f4b941] hover:bg-[#f4b941] hover:text-[#100359] transition-colors duration-200"
                    onClick={() => setIsOpen(false)}>
                News & Updates
              </Link>
              <Link href="/blog" 
                    className="block px-4 py-3 text-[#f4b941] hover:bg-[#f4b941] hover:text-[#100359] transition-colors duration-200"
                    onClick={() => setIsOpen(false)}>
                Blog/Resources
              </Link>
              <Link href="/faqs" 
                    className="block px-4 py-3 text-[#f4b941] hover:bg-[#f4b941] hover:text-[#100359] transition-colors duration-200"
                    onClick={() => setIsOpen(false)}>
                FAQs
              </Link>
              <Link href="/contact" 
                    className="block px-4 py-3 text-[#f4b941] hover:bg-[#f4b941] hover:text-[#100359] transition-colors duration-200"
                    onClick={() => setIsOpen(false)}>
                Contact Us
              </Link>
              <Link href="/terms" 
                    className="block px-4 py-3 text-[#f4b941] hover:bg-[#f4b941] hover:text-[#100359] transition-colors duration-200"
                    onClick={() => setIsOpen(false)}>
                Terms & Policies
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 
'use client'

// Note: Using standard HTML a tags instead of Next.js Link components
// due to type compatibility issues in Next.js 14.2.24 with server components.
// TODO: Revisit when upgrading Next.js or when the issue is resolved.

import Image from 'next/image'
import LogoMenu from '@/components/LogoMenu'
import SearchBar from '@/components/SearchBar'
import { useState, useEffect } from 'react'
import DropdownMenu from '@/components/DropdownMenu'
// import HeroSection from '@/components/HeroSection' - Component not found
// Using local component instead
// import FeaturesSection from '@/components/FeaturesSection' - Conflicts with local declaration
import ShowcaseSection from '@/components/ShowcaseSection'
// import CTASection from '@/components/CTASection' - Component not found
// Using local component instead
import { motion, AnimatePresence } from 'framer-motion'
import HeroSection from '@/components/HeroSection'
import { FeaturesSection } from '@/components/FeaturesSection'
import CTASection from '@/components/CTASection'
// HeroSection is already imported in the component
// import HeroSection from '@/components/HeroSection'
// Removing FeaturesSection import as it conflicts with local declaration
// HeroSection is already imported in the component
// import HeroSection from '@/components/HeroSection'
// Removing FeaturesSection import as it conflicts with local declaration

const showcases = [
  { id: 1, title: 'Project Alpha', description: 'Revolutionary CRM solution.' },
  { id: 2, title: 'Project Beta', description: 'Next-gen project management tool.' },
  { id: 3, title: 'Project Gamma', description: 'Innovative collaboration platform.' }
]

const features = [
  {
    title: 'Innovative Ideas',
    description: 'Submit and collaborate on cutting-edge SaaS solutions.',
    icon: '💡'
  },
  {
    title: 'Seamless Collaboration',
    description: 'Connect with industry experts and developers.',
    icon: '🤝'
  },
  {
    title: 'Instant Feedback',
    description: 'Get votes and comments from the community.',
    icon: '⚡'
  }
]

export default function Home() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f5f5f7'
    }}>
      <header style={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        padding: '1rem', 
        zIndex: 50 
      }}>
        <DropdownMenu />
      </header>
      <main>
        <HeroSection />
        <FeaturesSection features={features} />
        <ShowcaseSection />
        <CTASection />
      </main>
    </div>
  )
}

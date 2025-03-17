'use client'

// Note: Using standard HTML a tags instead of Next.js Link components
// due to type compatibility issues in Next.js 14.2.24 with server components.
// TODO: Revisit when upgrading Next.js or when the issue is resolved.

import Image from 'next/image'
import LogoMenu from '@/components/LogoMenu'
import SearchBar from '@/components/SearchBar'
import { useState, useEffect } from 'react'
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
import Footer from '@/components/Footer'
// HeroSection is already imported in the component
// import HeroSection from '@/components/HeroSection'
// Removing FeaturesSection import as it conflicts with local declaration
// HeroSection is already imported in the component
// import HeroSection from '@/components/HeroSection'
// Removing FeaturesSection import as it conflicts with local declaration

// Our feature cards for the "How It Works" section
const features = [
  {
    title: 'Search for Solutions',
    description: 'Dive into our curated directory of top SaaS tools designed to solve real problems. Find the software that fits your needs without the hassle.',
    imagePath: '/feature-analytics.png',
    buttonText: 'Learn More',
    buttonLink: '/how-it-works'
  },
  {
    title: 'Share Your Challenge',
    description: 'Can\'t find the perfect solution? Let us know about your unique challenge. We spotlight unmet needs, turning everyday issues into opportunities for breakthrough innovation.',
    imagePath: '/feature-saas.png',
    buttonText: 'View Solutions',
    buttonLink: '/solutions'
  },
  {
    title: 'Connect and Ignite Ideas',
    description: 'Join a vibrant community where business owners, developers, and entrepreneurs exchange insights. Spark discussions that transform challenges into actionable ideas and fuel next-level innovation.',
    imagePath: '/feature-choice.png',
    buttonText: 'Our Advantage',
    buttonLink: '/why-us'
  },
  {
    title: 'Promote and Scale',
    description: 'For developers, it\'s a launchpad to success. Showcase your established tools or debut new products to a targeted audience eager for smart, market-ready solutions that drive real business growth.',
    imagePath: '/feature-community.png',
    buttonText: 'Get Started',
    buttonLink: '/register'
  }
];

// Showcase projects
const showcases = [
  { 
    id: 1, 
    title: 'Project Alpha', 
    description: 'Revolutionary CRM solution with AI-powered analytics and customer insights.',
    image: '/showcase-alpha.png'
  },
  { 
    id: 2, 
    title: 'Project Beta', 
    description: 'Next-gen project management tool designed for distributed teams and complex workflows.',
    image: '/showcase-beta.png' 
  },
  { 
    id: 3, 
    title: 'Project Gamma', 
    description: 'Innovative collaboration platform integrating real-time communication and document management.',
    image: '/showcase-gamma.png'
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <main>
        {/* Hero Section with spark animation */}
        <HeroSection />
        
        {/* Features/How It Works Section */}
        <FeaturesSection features={features} />
        
        {/* Showcase Section */}
        <ShowcaseSection showcases={showcases} />
        
        {/* Call to Action Section */}
        <CTASection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

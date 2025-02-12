'use client'
import Link from 'next/link'
import Image from 'next/image'
import LogoMenu from '@/components/LogoMenu'
import SearchBar from '@/components/SearchBar'
import { useState, useEffect } from 'react'

export default function HomePage(): JSX.Element {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: '/about001.jpg',
      title: 'Connect & Innovate',
      description: 'Join a community of innovators and problem solvers'
    },
    {
      image: '/about002.jpg',
      title: 'Share Your Needs',
      description: 'Post your SaaS needs and get matched with solutions'
    },
    {
      image: '/about003.jpg',
      title: 'Build Solutions',
      description: 'Create the next great SaaS product based on real demand'
    },
    {
      image: '/about004.jpg',
      title: 'Grow Together',
      description: 'Scale your solutions with our supportive community'
    },
    {
      image: '/about005.jpg',
      title: 'Make an Impact',
      description: 'Transform ideas into successful SaaS businesses'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <main style={{ backgroundColor: '#eef7ff' }} className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Top Bar */}
        <div className="py-2 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <LogoMenu />
              <div className="w-64">
                <SearchBar />
              </div>
            </div>
            <div className="flex gap-6">
              <Link 
                href="/auth/signin"
                className="px-6 py-2 text-[#55b7ff] border-2 border-[#55b7ff] hover:bg-[#f4b941] hover:border-[#f4b941] hover:text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register"
                className="px-6 py-2 text-[#6735b1] border-2 border-[#6735b1] hover:bg-[#f4b941] hover:border-[#f4b941] hover:text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Register
              </Link>
            </div>
          </div>
        </div>

        {/* Rest of your content wrapped in the same container */}
        <div className="overflow-hidden">
          {/* Header */}
          <nav className="w-full">
            <div className="relative flex justify-center">
              <Image
                src="/header.png"
                alt="Shared Sparks"
                width={1200}
                height={300}
                className="w-full max-w-7xl object-contain"
                priority
              />
            </div>
          </nav>

          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-[#100359] sm:text-6xl tracking-tight">
                Sparking the Next SaaS Revolution
              </h1>
              <p className="mt-8 text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Connect unmet needs with innovative solutions.<br />
                Join a community where ideas ignite collaboration and progress.
              </p>
              
              <div className="mt-12 flex justify-center gap-8">
                <div className="flex flex-col items-center">
                  <Link 
                    href="/search-solutions"
                    className="px-10 py-5 text-[#55b7ff] border-2 border-[#55b7ff] hover:bg-[#f4b941] hover:border-[#f4b941] hover:text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg font-medium"
                  >
                    Search Solutions
                  </Link>
                  <p className="mt-4 text-gray-600 max-w-xs text-center text-sm">
                    Discover SaaS tools tailored to your needs.
                  </p>
                </div>
                
                <div className="flex flex-col items-center">
                  <Link 
                    href="/showcase-solutions"
                    className="px-10 py-5 text-[#6735b1] border-2 border-[#6735b1] hover:bg-[#f4b941] hover:border-[#f4b941] hover:text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg font-medium"
                  >
                    Showcase Solutions
                  </Link>
                  <p className="mt-4 text-gray-600 max-w-xs text-center text-sm">
                    Present your innovative solutions to a growing audience.
                  </p>
                </div>
              </div>
              
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-[#100359] tracking-tight">
                  What is Shared Sparks?
                </h2>
                <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Shared Sparks is a platform that bridges the gap between unique challenges and creative solutions. 
                  Whether you&apos;re looking for answers to specific problems or ready to innovate, 
                  we connect you with a community-driven marketplace of ideas and SaaS solutions.
                </p>
                <Link 
                  href="/about"
                  className="mt-12 inline-block px-10 py-5 text-[#6735b1] border-2 border-[#6735b1] hover:bg-[#f4b941] hover:border-[#f4b941] hover:text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg font-medium"
                >
                  Learn More About Our Mission
                </Link>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-gray-50 py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold text-[#100359] text-center tracking-tight">
                How Shared Sparks Works
              </h2>
              <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-3">
                <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-semibold text-[#55b7ff]">Submit Challenges</h3>
                  <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                    Share your biggest roadblocks and search for existing SaaS solutions tailored to your needs.
                  </p>
                </div>
                <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-semibold text-[#6735b1]">Discover Solutions</h3>
                  <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                    Browse a marketplace of unmet needs, vote on ideas, and explore developer-created tools.
                  </p>
                </div>
                <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-semibold text-[#f4b941]">Collaborate & Innovate</h3>
                  <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                    Connect with creators to refine problems, build solutions, and spark the next SaaS revolution.
                  </p>
                </div>
              </div>
              <div className="mt-16 text-center">
                <Link 
                  href="/get-started"
                  className="px-10 py-5 text-[#55b7ff] border-2 border-[#55b7ff] hover:bg-[#f4b941] hover:border-[#f4b941] hover:text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg font-medium"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold text-[#100359] text-center tracking-tight">
                Why Choose Shared Sparks?
              </h2>
              <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                <div className="p-8 border-2 border-[#55b7ff] rounded-xl hover:border-[#f4b941] transition-colors duration-300">
                  <h3 className="text-2xl font-semibold text-[#100359]">Problem Submission Portal</h3>
                  <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                    Simplified forms for easy challenge sharing.
                  </p>
                </div>
                <div className="p-8 border-2 border-[#6735b1] rounded-xl hover:border-[#f4b941] transition-colors duration-300">
                  <h3 className="text-2xl font-semibold text-[#100359]">Unmet Needs Marketplace</h3>
                  <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                    Publicly visible challenges to inspire innovation.
                  </p>
                </div>
                <div className="p-8 border-2 border-[#55b7ff] rounded-xl hover:border-[#f4b941] transition-colors duration-300">
                  <h3 className="text-2xl font-semibold text-[#100359]">SaaS Directory</h3>
                  <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                    Integrated with G2 and Capterra for solution discovery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Community Section - Reduced height */}
          <div className="bg-[#100359] text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Join a Growing Community of Innovators
              </h2>
              <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Be part of a global ecosystem where creators and thinkers collaborate to solve real-world problems. 
                Together, we&apos;re shaping the future of SaaS.
              </p>
              <Link 
                href="/register"
                className="mt-8 inline-block px-8 py-3 text-white border-2 border-white hover:bg-[#f4b941] hover:border-[#f4b941] hover:text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg font-medium"
              >
                Join Now
              </Link>
            </div>
          </div>

          {/* Success Stories Slideshow */}
          <section className="py-16 bg-[#eef7ff]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center text-[#100359] mb-12">
                Success Stories
              </h2>
              
              {/* Slideshow */}
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl mb-16">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000
                      ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white max-w-2xl mx-auto px-4">
                        <h3 className="text-3xl font-bold mb-4">{slide.title}</h3>
                        <p className="text-xl">{slide.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
               
                {/* Slide Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors
                        ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA Section - Reduced height */}
          <div className="bg-[#f4b941] text-[#100359] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to Spark the Next Revolution?
              </h2>
              <p className="mt-6 text-lg max-w-3xl mx-auto leading-relaxed">
                Submit your challenges, discover innovative ideas, and collaborate with creators to turn possibilities into realities.
              </p>
              <Link 
                href="/get-started"
                className="mt-8 inline-block px-8 py-3 text-[#100359] border-2 border-[#100359] hover:bg-[#100359] hover:text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg font-medium"
              >
                Start Now
              </Link>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-[#100359] text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                  <h3 className="text-xl font-semibold">About</h3>
                  <p className="mt-4 text-gray-300 leading-relaxed">
                    Shared Sparks is a platform for developers to connect and share software solutions.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Quick Links</h3>
                  <ul className="mt-4 space-y-3">
                    <li>
                      <Link 
                        href="https://www.maiven.co.uk" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-[#f4b941] transition-colors"
                      >
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="text-gray-300 hover:text-[#f4b941] transition-colors">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Connect</h3>
                  <ul className="mt-4 space-y-3">
                    <li>
                      <Link href="/github" className="text-gray-300 hover:text-[#f4b941] transition-colors">
                        GitHub
                      </Link>
                    </li>
                    <li>
                      <Link href="/twitter" className="text-gray-300 hover:text-[#f4b941] transition-colors">
                        Twitter
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  )
}

// Example JSX with unescaped single quotes
<div>
  <p>It&apos;s a great day to learn something new.</p>
  <p>Don&apos;t forget to check the documentation.</p>
</div>

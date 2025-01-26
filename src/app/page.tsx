import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="Shared Sparks" 
                className="h-8 w-auto"
              />
            </div>
            <div className="flex gap-6">
              <Link 
                href="/auth/login"
                className="text-[#100359] hover:text-[#f4b941] transition-colors text-sm"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/register"
                className="text-[#100359] hover:text-[#f4b941] transition-colors text-sm"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>

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
              Whether you're looking for answers to specific problems or ready to innovate, 
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

      {/* Community Section */}
      <div className="bg-[#100359] text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            Join a Growing Community of Innovators
          </h2>
          <p className="mt-8 text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Be part of a global ecosystem where creators and thinkers collaborate to solve real-world problems. 
            Together, we're shaping the future of SaaS.
          </p>
          <Link 
            href="/register"
            className="mt-12 inline-block px-10 py-5 text-white border-2 border-white hover:bg-[#f4b941] hover:border-[#f4b941] hover:text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg font-medium"
          >
            Join Now
          </Link>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-[#f4b941] text-[#100359] py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            Ready to Spark the Next Revolution?
          </h2>
          <p className="mt-8 text-xl max-w-3xl mx-auto leading-relaxed">
            Submit your challenges, discover innovative ideas, and collaborate with creators to turn possibilities into realities.
          </p>
          <Link 
            href="/get-started"
            className="mt-12 inline-block px-10 py-5 text-[#100359] border-2 border-[#100359] hover:bg-[#100359] hover:text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg font-medium"
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
                  <Link href="/about" className="text-gray-300 hover:text-[#f4b941] transition-colors">
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
  )
}

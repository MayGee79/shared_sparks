import Link from 'next/link'
import Image from 'next/image'
import LogoMenu from '@/components/LogoMenu'
import SearchBar from '@/components/SearchBar'

export default function About() {
  return (
    <main style={{ backgroundColor: '#eef7ff' }} className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="py-2 px-4 sm:px-6 lg:px-8">
          <LogoMenu />
          <SearchBar />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-6xl font-bold text-[#100359] mb-12 text-center">About Shared Sparks</h1>          
          <div className="flex items-center gap-8 mb-12">
            <div className="flex-1">
              <p className="text-lg text-gray-700">
                Welcome to Shared Sparks, where ideas ignite innovation and unmet needs spark revolutionary solutions. 
                We&apos;re more than a platform; we&apos;re a movement dedicated to connecting people, businesses, and developers 
                with the tools and community they need to solve real-world problems.
              </p>
            </div>
            <div className="flex-1">
              <Image 
                src="/about001.jpg"
                alt="About Shared Sparks"
                width={400}
                height={300}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="flex flex-row-reverse items-center gap-8 mb-12">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#55b7ff] mb-4">Our Mission</h2>
              <p className="text-gray-700">
                At Shared Sparks, our mission is simple: bridge the gap between unique challenges and creative solutions. 
                By empowering individuals and businesses to share their obstacles and encouraging developers to transform 
                them into scalable SaaS solutions, we&apos;re fostering a global ecosystem of collaboration and progress.
              </p>
            </div>
            <div className="flex-1">
              <Image 
                src="/about002.jpg"
                alt="Our Mission"
                width={400}
                height={300}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="flex items-center gap-8 mb-12">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#55b7ff] mb-4">Our Vision</h2>
              <p className="text-gray-700">
                We envision a future where every challenge becomes an opportunity and every great idea has a pathway 
                to realization. Shared Sparks aims to be the cornerstone of SaaS innovation—a space where unmet needs 
                are transformed into tools that empower users and drive change.
              </p>
            </div>
            <div className="flex-1">
              <Image 
                src="/about003.jpg"
                alt="Our Vision"
                width={400}
                height={300}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="flex flex-row-reverse items-center gap-8 mb-12">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#55b7ff] mb-4">What We Do</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Empower Problem-Solvers:</span>
                  By offering a dynamic marketplace of unmet needs, we highlight clear demand signals for developers and entrepreneurs.
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Fuel Innovation:</span>
                  Our platform provides resources, insights, and a collaborative environment to help turn great ideas into actionable solutions.
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Foster Collaboration:</span>
                  Shared Sparks connects innovators, developers, and users to refine ideas, create groundbreaking tools, and spark the next SaaS revolution.
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <Image 
                src="/about004.jpg"
                alt="What We Do"
                width={400}
                height={300}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="flex items-center gap-8 mb-12">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#55b7ff] mb-4">Why Choose Shared Sparks?</h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Community-Driven:</span>
                  We believe in the power of collaboration. Every user, challenge, and idea contributes to a vibrant, innovative community.
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Unmatched Resources:</span>
                  From an unmet needs marketplace to SaaS discovery tools, we provide everything you need to innovate, create, and succeed.
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">Focused on Results:</span>
                  Our platform is built to not only inspire ideas but to turn them into actionable, real-world solutions.
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <Image 
                src="/about005.jpg"
                alt="Why Choose Us"
                width={400}
                height={300}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#55b7ff] mb-4">Join the Movement</h2>
            <p className="text-gray-700 mb-6">
              Shared Sparks isn&apos;t just a platform; it&apos;s a partnership. Together, we can shape the future of SaaS 
              and redefine how the world solves its most pressing challenges. Whether you&apos;re here to share your 
              challenges, showcase your solutions, or explore the endless possibilities, Shared Sparks is your 
              home for innovation.
            </p>
            <div className="text-center">
              <Link 
                href="/auth/register"
                className="inline-block px-8 py-4 text-white bg-[#6735b1] hover:bg-[#f4b941] rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Ready to spark your next big idea? Join us today!
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

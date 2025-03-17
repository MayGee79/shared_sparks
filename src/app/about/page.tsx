'use client'

import { motion } from 'framer-motion'

export default function About() {
  return (
    <main className="bg-[var(--background)] py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-[var(--primary)]">About Shared Sparks</h1>
          <h2 className="text-2xl md:text-3xl text-[var(--primary)] mb-8">The Search is Over: Find, Build, and Spark Innovation</h2>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="prose prose-lg max-w-none text-[var(--primary)]"
          >
            <p className="text-lg mb-6">
              Every day, businesses struggle to find the perfect SaaS tool. Every day, SaaS founders fight to be discovered in an oversaturated market. And every day, someone asks the same question:
            </p>
            
            <p className="text-xl font-bold mb-6 text-center">
              "Is there a SaaS that does this?"
            </p>
            
            <p className="text-lg mb-6">
              At <span className="font-bold">Shared Sparks</span>, we make sure that question never goes unanswered.
            </p>
            
            <p className="text-lg mb-6">
              We are the <span className="font-bold">missing link between those searching for software and those creating it.</span> Whether you're looking for an existing tool or hoping to inspire the next great SaaS product, Shared Sparks brings together <span className="font-bold">problem solvers, innovators, and solutions—all in one place.</span>
            </p>
            
            <p className="text-lg mb-6">
              If the software exists, <span className="font-bold">we help you find it.</span> If it doesn't, <span className="font-bold">we help bring it to life.</span>
            </p>
            
            {/* Image placeholder 1 */}
            <div className="my-10 flex justify-center">
              <div className="relative w-full max-w-3xl h-64 bg-[var(--neutral)] rounded-xl overflow-hidden flex items-center justify-center">
                <p className="text-[var(--primary)] opacity-50">Image 1: Company Vision</p>
              </div>
            </div>
            
            <hr className="my-10 border-[var(--primary)] opacity-20" />
            
            <h2 className="text-3xl font-bold mb-6 text-[var(--primary)]">A Smarter Way to Connect Problems and Solutions</h2>
            
            <p className="text-lg mb-6">
              Finding the right software shouldn't feel like a guessing game. Yet, businesses waste hours scrolling through forums, asking on social media, and testing tools that don't fit.
            </p>
            
            <p className="text-lg mb-6">
              At the same time, developers spend months—sometimes years—building products without knowing if the demand is real.
            </p>
            
            <p className="text-lg mb-6">
              Shared Sparks fixes this disconnect by providing a <span className="font-bold">centralized, intelligent space</span> where:
            </p>
            
            <ul className="list-disc pl-6 mb-6 text-lg">
              <li className="mb-2">Businesses and professionals can <span className="font-bold">search for existing SaaS solutions</span> in a structured, easy-to-navigate platform.</li>
              <li className="mb-2">SaaS developers can <span className="font-bold">list their products</span> where their ideal users are actively looking.</li>
              <li className="mb-2">When no solution exists, <span className="font-bold">problem statements become blueprints for innovation</span>, offering clear direction for those ready to build.</li>
            </ul>
            
            <p className="text-lg mb-6">
              The result? <span className="font-bold">A faster, smarter, and more efficient way to match problems with solutions.</span>
            </p>
            
            {/* Image placeholder 2 */}
            <div className="my-10 flex justify-center">
              <div className="relative w-full max-w-3xl h-64 bg-[var(--neutral)] rounded-xl overflow-hidden flex items-center justify-center">
                <p className="text-[var(--primary)] opacity-50">Image 2: Problem-Solution Matching</p>
              </div>
            </div>
            
            <hr className="my-10 border-[var(--primary)] opacity-20" />
            
            <h2 className="text-3xl font-bold mb-6 text-[var(--primary)]">More Than a SaaS Directory—A Platform for Growth</h2>
            
            <p className="text-lg mb-6">
              Shared Sparks is built for those who refuse to settle for inefficiencies.
            </p>
            
            <p className="text-lg mb-6">
              For businesses and entrepreneurs, it's a <span className="font-bold">shortcut to discovery</span>—a way to find the right tools without endless searching. For developers, it's a <span className="font-bold">strategic advantage</span>—a space where their products don't get lost in the noise but instead meet the users who need them most.
            </p>
            
            <p className="text-lg mb-6">
              And for the SaaS industry as a whole, it's a <span className="font-bold">fundamental shift in how software is found, built, and validated.</span>
            </p>
            
            <p className="text-lg mb-6">
              We don't just list software. <span className="font-bold">We connect solutions to the people who need them.</span>
            </p>
            
            {/* Image placeholder 3 */}
            <div className="my-10 flex justify-center">
              <div className="relative w-full max-w-3xl h-64 bg-[var(--neutral)] rounded-xl overflow-hidden flex items-center justify-center">
                <p className="text-[var(--primary)] opacity-50">Image 3: Platform Growth</p>
              </div>
            </div>
            
            <hr className="my-10 border-[var(--primary)] opacity-20" />
            
            <h2 className="text-3xl font-bold mb-6 text-[var(--primary)]">Join the Shared Sparks Movement</h2>
            
            <p className="text-lg mb-6">
              If you've ever searched, <span className="font-bold">"Is there a SaaS that does this?"</span>—Shared Sparks is your answer.
            </p>
            
            <p className="text-lg mb-6">
              If you're a SaaS founder, <span className="font-bold">tired of being overlooked in crowded marketplaces,</span> this is your platform.
            </p>
            
            <p className="text-lg mb-6">
              <span className="font-bold">The best software doesn't just appear—it's found, shaped, and built by the people who need it most.</span>
            </p>
            
            <p className="text-xl font-bold mb-10 text-center">
              Shared Sparks is where that happens.
            </p>
            
            <div className="text-center">
              <motion.a
                href="/auth/register"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-4 text-lg font-semibold rounded-full bg-[var(--accent)] text-[var(--primary)] shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Today
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

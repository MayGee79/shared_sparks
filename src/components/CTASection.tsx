'use client';

import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Background spark effect */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="hero-spark"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-white mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Ready to Join the SaaS Revolution?
        </motion.h2>
        
        <motion.p
          className="text-xl text-gray-300 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Share your innovative ideas, connect with experts, and build the next generation of software solutions.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <a 
            href="/auth/register"
            className="inline-block px-10 py-4 text-xl font-semibold rounded-full bg-accent text-primary shadow-lg hover:transform hover:scale-105 transition-all duration-300"
          >
            Get Started Now
          </a>
        </motion.div>
      </div>
    </section>
  )
} 
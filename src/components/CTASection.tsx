'use client';

import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-background mb-6">
          Ready to Spark Change?
        </h2>
        <motion.a
          href="/auth/register"
          className="inline-block px-10 py-4 text-xl font-semibold rounded-full bg-accent text-primary shadow-lg"
          whileHover={{ scale: 1.05, boxShadow: '0 0 10px var(--accent)' }}
          whileTap={{ scale: 0.95 }}
        >
          Submit Your Idea
        </motion.a>
      </div>
    </section>
  )
} 
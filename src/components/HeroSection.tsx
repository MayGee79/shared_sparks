import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="relative flex items-center justify-center h-screen bg-primary">
      {/* Animated Sparks Overlay */}
      <div className="absolute inset-0 opacity-20 bg-[#55b7ff10]"></div>
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Sparking the SaaS Revolution
        </h1>
        <motion.a
          href="/auth/register"
          className="inline-block px-8 py-4 text-xl font-semibold rounded-full bg-accent text-primary shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.a>
      </div>
    </section>
  )
} 
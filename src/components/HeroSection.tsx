import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HeroSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  }

  return (
    <section className="relative h-screen overflow-hidden bg-primary p-4 md:p-8">
      {/* Main Container with rounded corners */}
      <div className="relative h-full w-full rounded-3xl shadow-2xl overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero_image.png"
            alt="Hero Background"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-primary/80 z-10"></div>
        </div>

        {/* Header with dropdown menu */}
        <div className="relative z-30 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a href="/" className="text-xl font-bold text-white flex items-center">
                Shared Sparks
              </a>
            </motion.div>
            <div className="relative" ref={menuRef}>
              <motion.button 
                className="text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </motion.button>
              
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div 
                    className="dropdown-menu rounded-xl overflow-hidden"
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {['Home', 'About Us', 'FAQs', 'Blog / Insights', 'Contact Us', 'Register', 'Log In'].map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        whileHover={{ 
                          backgroundColor: 'var(--accent)', 
                          color: 'var(--primary)',
                          x: 5 
                        }}
                      >
                        <a 
                          href={
                            item === 'Home' ? '/' : 
                            item === 'About Us' ? '/about' :
                            item === 'FAQs' ? '/faqs' :
                            item === 'Blog / Insights' ? '/blog' :
                            item === 'Contact Us' ? '/contact' :
                            item === 'Register' ? '/auth/register' :
                            item === 'Log In' ? '/auth/login' :
                            '/'
                          } 
                          className="dropdown-menu-item block"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item}
                        </a>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
          <div className="container mx-auto text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-white"
              custom={0}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <span className="bg-primary rounded-lg px-6 py-4 inline-block shadow-lg text-center" style={{ backgroundColor: 'var(--primary)' }}>
                SPARKING THE NEXT<br />
                <motion.span 
                  className="text-accent"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  SAAS REVOLUTION
                </motion.span>
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-white/80 max-w-2xl mb-10 mx-auto"
              custom={1}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              Connect with innovators, share your ideas, and build the next generation of software solutions.
            </motion.p>
            
            <motion.div
              custom={2}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a 
                href="/auth/register" 
                className="text-lg px-8 py-4 relative group overflow-hidden rounded-full bg-primary text-white transition-colors duration-300 hover:bg-accent"
              >
                <span className="relative z-10">Get Started</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
} 
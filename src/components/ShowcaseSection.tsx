'use client'

import { motion } from 'framer-motion'

type Showcase = {
  id: number
  title: string
  description: string
  image?: string
}

interface ShowcaseSectionProps {
  showcases?: Showcase[]
}

// Default showcases if none provided
const defaultShowcases = [
  { id: 1, title: 'SaaS Alpha', description: 'Revolutionary CRM solution.' },
  { id: 2, title: 'SaaS Beta', description: 'Next-gen project management tool.' },
  { id: 3, title: 'SaaS Gamma', description: 'Innovative collaboration platform.' }
]

export default function ShowcaseSection({ showcases = defaultShowcases }: ShowcaseSectionProps) {
  return (
    <section id="showcase" className="py-20" style={{ backgroundColor: 'var(--neutral)' }}>
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-12" style={{ color: 'var(--primary)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Featured SaaS
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {showcases.map((showcase, index) => (
            <motion.div
              key={showcase.id}
              className="rounded-lg p-6 flex flex-col h-full shadow-lg" style={{ backgroundColor: 'var(--primary)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
            >
              {showcase.image && (
                <div className="h-40 bg-gray-800 rounded-lg mb-4 overflow-hidden">
                  <div className="w-full h-full relative">
                    <img 
                      src={showcase.image} 
                      alt={showcase.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-3 text-white">{showcase.title}</h3>
              <p className="text-white/70 mb-4">{showcase.description}</p>
              
              <motion.button
                className="mt-auto inline-block py-2 px-4 rounded font-semibold text-center" 
                style={{ backgroundColor: 'var(--accent)', color: 'var(--primary)' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                View Project
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 
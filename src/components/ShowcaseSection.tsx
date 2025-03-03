'use client'

// Remove framer-motion import if not installed
// import { motion } from 'framer-motion'

const showcases = [
  { id: 1, title: 'Project Alpha', description: 'Revolutionary CRM solution.' },
  { id: 2, title: 'Project Beta', description: 'Next-gen project management tool.' },
  { id: 3, title: 'Project Gamma', description: 'Innovative collaboration platform.' }
]

export default function ShowcaseSection() {
  return (
    <section id="showcase" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {showcases.map((showcase) => (
            <div
              key={showcase.id}
              className="p-6 rounded-lg shadow-md bg-primary text-white"
            >
              <h3 className="text-xl font-bold mb-2">{showcase.title}</h3>
              <p>{showcase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 
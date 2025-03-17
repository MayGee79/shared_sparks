import React from 'react';
import { motion } from 'framer-motion';

type Feature = {
  title: string;
  description: string;
  icon?: string;
  imagePath?: string;
  buttonText?: string;
  buttonLink?: string;
};

export function FeaturesSection({ features = defaultFeatures }: { features?: Feature[] }) {
  return (
    <section id="how-it-works" className="py-20" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--primary)' }}>How It Works</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--primary)' }}>
            Discover, connect, and collaborate on innovative SaaS solutions that solve real business challenges. Join our ecosystem of creators and problem-solvers.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-primary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-6 bg-primary">
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-white/90 mb-6 text-sm">{feature.description}</p>
                
                {feature.buttonText && feature.buttonLink && (
                  <div className="mt-auto">
                    <a href={feature.buttonLink}>
                      <span className="inline-block w-full text-center py-2 px-4 rounded transition-all duration-300 hover:shadow-md font-semibold"
                           style={{ backgroundColor: 'var(--accent)', color: 'var(--primary)' }}>
                        {feature.buttonText}
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const defaultFeatures: Feature[] = [
  {
    title: 'Search for Solutions',
    description: 'Dive into our curated directory of top SaaS tools designed to solve real problems. Find the software that fits your needs without the hassle.',
    buttonText: 'Submit a Challenge',
    buttonLink: '/submit'
  },
  {
    title: 'Share Your Challenge',
    description: 'Can\'t find the perfect solution? Let us know about your unique challenge. We spotlight unmet needs, turning everyday issues into opportunities for breakthrough innovation.',
    buttonText: 'Explore Marketplace',
    buttonLink: '/marketplace'
  },
  {
    title: 'Connect and Ignite Ideas',
    description: 'Join a vibrant community where business owners, developers, and entrepreneurs exchange insights. Spark discussions that transform challenges into actionable ideas and fuel next-level innovation.',
    buttonText: 'For Developers',
    buttonLink: '/developers'
  },
  {
    title: 'Promote and Scale',
    description: 'For developers, it\'s a launchpad to success. Showcase your established tools or debut new products to a targeted audience eager for smart, market-ready solutions that drive real business growth.',
    buttonText: 'Success Stories',
    buttonLink: '/success'
  }
]; 
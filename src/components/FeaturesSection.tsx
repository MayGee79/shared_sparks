import React from 'react';

type Feature = {
  title: string;
  description: string;
  icon: string;
};

export function FeaturesSection({ features = [] }: { features?: Feature[] }) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 border rounded-lg shadow-sm">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const defaultFeatures: Feature[] = [
  {
    title: 'Innovative Ideas',
    description: 'Submit and collaborate on cutting-edge SaaS solutions.',
    icon: '💡'
  },
  {
    title: 'Seamless Collaboration',
    description: 'Connect with industry experts and developers.',
    icon: '🤝'
  },
  {
    title: 'Instant Feedback',
    description: 'Get votes and comments from the community.',
    icon: '⚡'
  }
]; 
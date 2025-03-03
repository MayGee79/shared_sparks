import React from 'react';

export default function FAQ(): React.ReactNode {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      
      <div className="space-y-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">What is Shared Sparks?</h2>
          <p>Shared Sparks is a platform connecting SaaS solutions with businesses facing specific challenges.</p>
        </div>
        
        {/* Add more FAQ items as needed */}
      </div>
    </div>
  );
}
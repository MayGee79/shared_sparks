'use client'

export default function About() {
  return (
    <main style={{ 
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
          About Shared Sparks
        </h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '1rem', lineHeight: '1.6' }}>
            Welcome to Shared Sparks, where ideas ignite innovation and unmet needs spark revolutionary solutions. 
            We're more than a platform; we're a movement dedicated to connecting people, businesses, and developers 
            with the tools and community they need to solve real-world problems.
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#55b7ff', marginBottom: '1rem' }}>
            Our Mission
          </h2>
          <p style={{ color: '#4b5563', marginBottom: '1rem', lineHeight: '1.6' }}>
            At Shared Sparks, our mission is simple: bridge the gap between unique challenges and creative solutions. 
            By empowering individuals and businesses to share their obstacles and encouraging developers to transform 
            them into scalable SaaS solutions, we're fostering a global ecosystem of collaboration and progress.
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#55b7ff', marginBottom: '1rem' }}>
            Join the Movement
          </h2>
          <p style={{ color: '#4b5563', marginBottom: '1rem', lineHeight: '1.6' }}>
            Shared Sparks isn't just a platform; it's a partnership. Together, we can shape the future of SaaS 
            and redefine how the world solves its most pressing challenges.
          </p>
          <div style={{ textAlign: 'center' }}>
            <a 
              href="/auth/register"
              style={{ 
                display: 'inline-block', 
                padding: '1rem 2rem', 
                backgroundColor: '#55b7ff', 
                color: 'white', 
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'background-color 0.2s ease-in-out'
              }}
            >
              Ready to spark your next big idea? Join us today!
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

'use client'

// Note: Adding 'use client' directive to fix component compatibility issues
// with Next.js 14.2.24 server components.
// TODO: Revisit when upgrading Next.js or when the issue is resolved.

import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'

type SearchablePages = {
  title: string;
  path: string;
  content: string[];
}

// Example of searchable content
const siteContent: SearchablePages[] = [
  {
    title: "Home",
    path: "/",
    content: ["Sparking the Next SaaS Revolution", "Connect unmet needs with innovative solutions"]
  },
  {
    title: "About",
    path: "/about",
    content: ["About Shared Sparks", "Our mission and vision"]
  },
  {
    title: "News & Updates",
    path: "/news",
    content: ["Latest updates", "Platform news"]
  },
  {
    title: "Blog/Resources",
    path: "/blog",
    content: ["Blog posts", "Resources and guides"]
  },
  {
    title: "FAQs",
    path: "/faqs",
    content: ["Frequently asked questions", "Help and support"]
  }
]

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchablePages[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) {
      setResults([])
      return
    }

    const searchResults = siteContent.filter(page => 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.content.some(text => text.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    setResults(searchResults)
    setShowResults(true)
  }

  return (
    <div style={{ position: 'relative' }}>
      <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '42rem', margin: '0 auto' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              if (e.target.value === '') {
                setShowResults(false)
              }
            }}
            placeholder="Search site content..."
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              paddingLeft: '3rem', 
              borderRadius: '0.5rem', 
              border: '2px solid #55b7ff', 
              transition: 'border-color 0.2s ease-in-out',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#f4b941';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#55b7ff';
            }}
          />
          <button 
            type="submit"
            style={{ 
              position: 'absolute', 
              left: '0.75rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#55b7ff',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#f4b941';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#55b7ff';
            }}
          >
            <FiSearch size={20} />
          </button>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0,
          marginTop: '0.5rem',
          background: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          maxHeight: '24rem',
          overflowY: 'auto',
          zIndex: 50
        }}>
          {results.map((result, index) => (
            <a
              key={index}
              href={result.path}
              style={{ 
                display: 'block', 
                padding: '0.75rem 1rem', 
                borderBottom: index === results.length - 1 ? 'none' : '1px solid #e5e7eb'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(244, 185, 65, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <h3 style={{ fontWeight: 'bold', color: '#100359' }}>{result.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#4b5563', marginTop: '0.25rem' }}>
                {result.content[0].substring(0, 100)}...
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  )
} 
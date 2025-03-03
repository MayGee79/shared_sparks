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
    <div className="relative">
      <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
        <div className="relative">
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
            className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-[#55b7ff] focus:border-[#f4b941] focus:outline-none transition-colors"
          />
          <button 
            type="submit"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#55b7ff] hover:text-[#f4b941]"
          >
            {/* @ts-expect-error - FiSearch is a valid React component despite the type error */}
            <FiSearch size={20} />
          </button>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {results.map((result, index) => (
            <a
              key={index}
              href={result.path}
              className="block px-4 py-3 hover:bg-[#f4b941]/10 border-b last:border-b-0"
            >
              <h3 className="font-semibold text-[#100359]">{result.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {result.content[0].substring(0, 100)}...
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  )
} 
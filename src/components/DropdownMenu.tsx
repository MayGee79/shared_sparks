'use client';

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '#features' },
  { label: 'Submit an Idea', href: '/submit' },
  { label: 'Explore Solutions', href: '/solutions' },
  { label: 'SaaS Directory', href: '/saas' },
  { label: 'Sign Up / Log In', href: '/auth/login' }
]

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle menu"
        style={{ 
          fontSize: '1.25rem', 
          color: '#f4b941'
        }}
      >
        ☰
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ 
              position: 'absolute', 
              right: 0, 
              marginTop: '0.5rem', 
              width: '12rem', 
              borderRadius: '0.375rem', 
              backgroundColor: 'white', 
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              zIndex: 50
            }}
          >
            <ul style={{ padding: '0.25rem 0' }}>
              {menuItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    style={{ 
                      display: 'block', 
                      padding: '0.5rem 1rem', 
                      fontSize: '0.875rem', 
                      color: '#4b5563', 
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
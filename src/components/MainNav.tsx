'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function MainNav() {
  const pathname = usePathname()
  
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Browse', href: '/search' },
    { label: 'Categories', href: '/categories' },
    { label: 'Submit', href: '/submit' },
  ]
  
  return (
    <nav className="flex items-center space-x-6 mr-6">
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-bold text-xl">SaaSpot</span>
      </Link>
      <div className="hidden md:flex space-x-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href || 
              (item.href !== '/' && pathname?.startsWith(item.href))
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
} 
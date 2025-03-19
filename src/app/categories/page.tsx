'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Grid, FolderIcon } from 'lucide-react'

type Category = {
  name: string
  count: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        const res = await fetch('/api/saas/search?limit=1')
        const data = await res.json()
        
        if (data.filters && data.filters.categories) {
          setCategories(data.filters.categories)
        } else {
          setError('Failed to fetch categories')
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('Failed to fetch categories. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const getRandomColor = (index: number) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-red-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-cyan-500', 'bg-emerald-500'
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SaaS Categories</h1>
        <p className="text-muted-foreground">
          Browse our catalog of SaaS tools by category
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(9).fill(0).map((_, i) => (
            <Card key={i} className="h-48">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={category.name} 
              href={`/search?category=${encodeURIComponent(category.name)}`}
              className="group"
            >
              <Card className="h-48 flex flex-col transition-all hover:shadow-md group-hover:border-primary">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${getRandomColor(index)} flex items-center justify-center text-white mb-2`}>
                    <FolderIcon size={24} />
                  </div>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.count} {category.count === 1 ? 'tool' : 'tools'}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">
                    Browse all {category.name.toLowerCase()} tools
                  </p>
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground group-hover:text-primary">
                  View Category
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 
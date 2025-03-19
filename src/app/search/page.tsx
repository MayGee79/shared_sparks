'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Star, Search, Filter, X, ExternalLink, Lock, LogIn } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Type definitions
type SaaSItem = {
  id: string
  name: string
  description: string
  website: string
  category: string
  pricingModel: string
  tags: string[]
  logo: string | null
  averageRating: number
  features: string[]
  pros: string[]
  cons: string[]
  createdAt: string
  submitter: {
    username: string
    image: string | null
  }
  _count: {
    favorites: number
    reviews: number
  }
}

type PaginationInfo = {
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

type FilterOption = {
  name: string
  count: number
}

type Filters = {
  categories: FilterOption[]
  pricingModels: FilterOption[]
  popularTags: string[]
}

type SearchResult = {
  items: SaaSItem[]
  pagination: PaginationInfo
  filters: Filters
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'
  
  // State variables
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedPricing, setSelectedPricing] = useState(searchParams.get('pricing') || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get('tags') ? searchParams.get('tags')!.split(',') : []
  )
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'popular')
  const [showFilters, setShowFilters] = useState(false)
  const currentPage = parseInt(searchParams.get('page') || '1')
  
  // Constants for limiting non-registered user experience
  const MAX_NON_AUTH_RESULTS = 6 // Show only 6 results for non-authenticated users
  const MAX_NON_AUTH_PAGES = 1 // Only allow first page for non-authenticated users
  
  // Effect to fetch search results when parameters change
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Construct query params
        const params = new URLSearchParams()
        if (searchParams.get('q')) params.append('q', searchParams.get('q')!)
        if (searchParams.get('category')) params.append('category', searchParams.get('category')!)
        
        // Only add additional filters if user is authenticated
        if (isAuthenticated) {
          if (searchParams.get('pricing')) params.append('pricing', searchParams.get('pricing')!)
          if (searchParams.get('tags')) params.append('tags', searchParams.get('tags')!)
          if (searchParams.get('page')) params.append('page', searchParams.get('page')!)
        } else {
          // For non-authenticated users, always use page 1 and limit results
          params.append('page', '1')
          params.append('limit', MAX_NON_AUTH_RESULTS.toString())
        }
        
        if (searchParams.get('sortBy')) params.append('sortBy', searchParams.get('sortBy')!)
        
        const response = await fetch(`/api/saas/search?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results')
        }
        
        const data = await response.json()
        setSearchResults(data)
      } catch (err) {
        console.error('Error fetching search results:', err)
        setError('Failed to fetch search results. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchSearchResults()
  }, [searchParams, isAuthenticated])
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Construct query params for router
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategory) params.set('category', selectedCategory)
    
    // Only add advanced filters for authenticated users
    if (isAuthenticated) {
      if (selectedPricing) params.set('pricing', selectedPricing)
      if (selectedTags.length > 0) params.set('tags', selectedTags.join(','))
    }
    
    params.set('sortBy', sortBy)
    params.set('page', '1') // Reset to first page
    
    // Update URL with new search params
    router.push(`/search?${params.toString()}`)
  }
  
  // Handle tag selection/deselection
  const toggleTag = (tag: string) => {
    if (!isAuthenticated) {
      // Don't allow tag selection for non-authenticated users
      return
    }
    
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }
  
  // Handle sorting change
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sortBy', value)
    router.push(`/search?${params.toString()}`)
  }
  
  // Handle pagination
  const goToPage = (page: number) => {
    if (!isAuthenticated && page > MAX_NON_AUTH_PAGES) {
      return
    }
    
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/search?${params.toString()}`)
  }
  
  // Clear all filters
  const clearFilters = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    params.set('sortBy', 'popular')
    params.set('page', '1')
    router.push(`/search?${params.toString()}`)
    
    setSelectedCategory('')
    setSelectedPricing('')
    setSelectedTags([])
    setSortBy('popular')
  }
  
  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
        <span className="ml-1 text-sm font-medium">
          {rating.toFixed(1)}
        </span>
      </div>
    )
  }
  
  // Render a locked feature with tooltip
  const renderLockedFeature = (text: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 cursor-not-allowed text-muted-foreground">
            <Lock size={14} />
            <span>{text}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Sign in to unlock this feature</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search SaaS Directory</h1>
      
      {/* Premium features banner for non-authenticated users */}
      {!isAuthenticated && (
        <div className="mb-8 p-4 border border-primary/20 bg-primary/5 rounded-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Unlock Premium Search Features</h3>
              <p className="text-muted-foreground">
                Sign in to access advanced filters, view all results, save searches, and more.
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/signin">
                <Button variant="outline" className="gap-2">
                  <LogIn size={16} />
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="gap-2">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for SaaS tools..."
              className="pl-10"
            />
          </div>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="sm:w-auto w-full"
          >
            <Filter size={18} className="mr-2" />
            Filters
            {(selectedCategory || (isAuthenticated && (selectedPricing || selectedTags.length > 0))) && (
              <Badge variant="secondary" className="ml-2">
                {(selectedCategory ? 1 : 0) + 
                 (isAuthenticated ? (selectedPricing ? 1 : 0) + (selectedTags.length) : 0)}
              </Badge>
            )}
          </Button>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="sm:w-[180px] w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="sm:w-auto w-full">Search</Button>
        </div>
        
        {/* Filters section */}
        {showFilters && searchResults?.filters && (
          <div className="mt-4 p-4 border rounded-lg bg-background">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm">
                Clear all
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Categories - Available to all users */}
              <div>
                <h4 className="font-medium mb-2">Categories</h4>
                <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                  {searchResults.filters.categories.map((category) => (
                    <div key={category.name} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category.name}`}
                        name="category"
                        checked={selectedCategory === category.name}
                        onChange={() => {
                          setSelectedCategory(
                            selectedCategory === category.name ? '' : category.name
                          )
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`category-${category.name}`} className="flex-grow">
                        {category.name}
                      </label>
                      <span className="text-sm text-gray-500">({category.count})</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Pricing Models - Premium feature */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  Pricing Models 
                  {!isAuthenticated && <Lock size={14} className="text-muted-foreground" />}
                </h4>
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                    {searchResults.filters.pricingModels.map((pricing) => (
                      <div key={pricing.name} className="flex items-center">
                        <input
                          type="radio"
                          id={`pricing-${pricing.name}`}
                          name="pricing"
                          checked={selectedPricing === pricing.name}
                          onChange={() => {
                            setSelectedPricing(
                              selectedPricing === pricing.name ? '' : pricing.name
                            )
                          }}
                          className="mr-2"
                        />
                        <label htmlFor={`pricing-${pricing.name}`} className="flex-grow">
                          {pricing.name}
                        </label>
                        <span className="text-sm text-gray-500">({pricing.count})</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-col gap-2 border border-dashed rounded p-3 bg-muted/50">
                    <div className="flex flex-col gap-1">
                      {searchResults.filters.pricingModels.slice(0, 3).map((pricing) => (
                        <div key={pricing.name} className="flex items-center opacity-50">
                          <div className="w-4 h-4 border rounded-sm mr-2"></div>
                          <span className="flex-grow">{pricing.name}</span>
                          <span className="text-sm text-gray-500">({pricing.count})</span>
                        </div>
                      ))}
                      <div className="mt-2 text-center">
                        <Link href="/signin">
                          <Button variant="outline" size="sm" className="text-xs">
                            Sign in to filter by pricing
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Popular Tags - Premium feature */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  Popular Tags
                  {!isAuthenticated && <Lock size={14} className="text-muted-foreground" />}
                </h4>
                {isAuthenticated ? (
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {searchResults.filters.popularTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                        {selectedTags.includes(tag) && (
                          <X size={14} className="ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed rounded p-3 bg-muted/50">
                    <div className="flex flex-wrap gap-2 opacity-50">
                      {searchResults.filters.popularTags.slice(0, 6).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-not-allowed"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2 text-center">
                      <Link href="/signin">
                        <Button variant="outline" size="sm" className="text-xs">
                          Sign in to filter by tags
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSearch}>Apply Filters</Button>
            </div>
          </div>
        )}
      </form>
      
      {/* Applied filters display */}
      {(selectedCategory || (isAuthenticated && (selectedPricing || selectedTags.length > 0))) && (
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium">Active filters:</span>
          
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {selectedCategory}
              <X 
                size={14} 
                className="cursor-pointer" 
                onClick={() => {
                  setSelectedCategory('')
                  const params = new URLSearchParams(searchParams.toString())
                  params.delete('category')
                  router.push(`/search?${params.toString()}`)
                }}
              />
            </Badge>
          )}
          
          {isAuthenticated && selectedPricing && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Pricing: {selectedPricing}
              <X 
                size={14} 
                className="cursor-pointer" 
                onClick={() => {
                  setSelectedPricing('')
                  const params = new URLSearchParams(searchParams.toString())
                  params.delete('pricing')
                  router.push(`/search?${params.toString()}`)
                }}
              />
            </Badge>
          )}
          
          {isAuthenticated && selectedTags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X 
                size={14} 
                className="cursor-pointer" 
                onClick={() => {
                  const newTags = selectedTags.filter(t => t !== tag)
                  setSelectedTags(newTags)
                  const params = new URLSearchParams(searchParams.toString())
                  if (newTags.length) {
                    params.set('tags', newTags.join(','))
                  } else {
                    params.delete('tags')
                  }
                  router.push(`/search?${params.toString()}`)
                }}
              />
            </Badge>
          ))}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-sm hover:bg-destructive/10"
          >
            Clear all
          </Button>
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-4 mb-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
              <Skeleton className="h-20 w-full mb-3" />
              <div className="flex gap-2 mb-3">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Error state */}
      {error && !loading && (
        <div className="py-10 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={handleSearch}>Try Again</Button>
        </div>
      )}
      
      {/* No results */}
      {!loading && !error && searchResults?.items.length === 0 && (
        <div className="py-10 text-center">
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
      
      {/* Search results */}
      {!loading && !error && searchResults?.items.length > 0 && (
        <>
          <p className="mb-4 text-sm text-gray-500">
            Showing {searchResults.items.length} of {searchResults.pagination.totalItems} results
            {!isAuthenticated && searchResults.pagination.totalItems > MAX_NON_AUTH_RESULTS && (
              <span className="ml-1 text-primary font-medium">
                (Sign in to see all results)
              </span>
            )}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.items.map((item) => (
              <Card key={item.id} className="overflow-hidden flex flex-col">
                <div className="p-4 flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    {item.logo ? (
                      <Image 
                        src={item.logo} 
                        alt={item.name} 
                        width={48} 
                        height={48} 
                        className="rounded-md object-contain bg-gray-50"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-xl font-bold text-primary">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3 line-clamp-3">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    {renderStars(item.averageRating)}
                    <span className="text-sm text-gray-500">
                      {item._count.reviews} reviews
                    </span>
                  </div>
                </div>
                
                <div className="bg-muted p-3 flex justify-between items-center mt-auto">
                  <Link 
                    href={`/saas/${item.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    View Details
                  </Link>
                  <a 
                    href={item.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary flex items-center hover:underline"
                  >
                    Visit <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
          
          {/* "See More" banner for non-authenticated users */}
          {!isAuthenticated && searchResults.pagination.totalItems > MAX_NON_AUTH_RESULTS && (
            <div className="mt-8 p-6 border border-primary/20 bg-primary/5 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">
                {searchResults.pagination.totalItems - MAX_NON_AUTH_RESULTS} more results available
              </h3>
              <p className="mb-4 text-muted-foreground">
                Sign in to view all available SaaS tools and unlock advanced search features.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Create Account</Button>
                </Link>
              </div>
            </div>
          )}
          
          {/* Pagination - Limited for non-authenticated users */}
          {isAuthenticated && searchResults.pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {[...Array(searchResults.pagination.totalPages)].map((_, i) => {
                  const page = i + 1
                  // Show first, last, current and pages around current
                  if (
                    page === 1 ||
                    page === searchResults.pagination.totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page)}
                        className="w-9"
                      >
                        {page}
                      </Button>
                    )
                  } else if (
                    page === currentPage - 3 ||
                    page === currentPage + 3
                  ) {
                    return <span key={page}>...</span>
                  }
                  return null
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === searchResults.pagination.totalPages}
                >
                  Next
                </Button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  )
} 
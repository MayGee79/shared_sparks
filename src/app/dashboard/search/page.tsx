'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Star, 
  Search, 
  Filter, 
  X, 
  ExternalLink, 
  BookmarkPlus,
  BookmarkCheck,
  History,
  Save
} from 'lucide-react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

import DashboardLayout from '../layout'

// Type definitions similar to the public search page...

export default function DashboardSearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  
  // State variables
  const [searchResults, setSearchResults] = useState<any | null>(null)
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
  
  // User favorites
  const [favorites, setFavorites] = useState<string[]>([])
  const [saveSearchOpen, setSaveSearchOpen] = useState(false)
  const [savedSearchName, setSavedSearchName] = useState('')
  const [receiveAlerts, setReceiveAlerts] = useState(true)
  
  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Construct query params
        const params = new URLSearchParams()
        if (searchParams.get('q')) params.append('q', searchParams.get('q')!)
        if (searchParams.get('category')) params.append('category', searchParams.get('category')!)
        if (searchParams.get('pricing')) params.append('pricing', searchParams.get('pricing')!)
        if (searchParams.get('tags')) params.append('tags', searchParams.get('tags')!)
        if (searchParams.get('page')) params.append('page', searchParams.get('page')!)
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
    
    // Also fetch user favorites
    fetchUserFavorites()
  }, [searchParams])
  
  // Fetch user favorites
  const fetchUserFavorites = async () => {
    try {
      const response = await fetch('/api/user/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.map((fav: any) => fav.saasId))
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }
  
  // Toggle favorite status
  const toggleFavorite = async (saasId: string) => {
    try {
      const isFavorite = favorites.includes(saasId)
      const endpoint = isFavorite ? `/api/user/favorites/${saasId}` : '/api/user/favorites'
      const method = isFavorite ? 'DELETE' : 'POST'
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: isFavorite ? undefined : JSON.stringify({ saasId }),
      })
      
      if (response.ok) {
        if (isFavorite) {
          setFavorites(favorites.filter(id => id !== saasId))
        } else {
          setFavorites([...favorites, saasId])
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }
  
  // Save the current search
  const saveCurrentSearch = async () => {
    try {
      if (!savedSearchName.trim()) {
        return
      }
      
      const searchData = {
        name: savedSearchName,
        query: searchQuery || undefined,
        category: selectedCategory || undefined,
        pricingModel: selectedPricing || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        receiveAlerts
      }
      
      const response = await fetch('/api/user/saved-searches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      })
      
      if (response.ok) {
        setSaveSearchOpen(false)
        setSavedSearchName('')
        // Could show success notification here
      }
    } catch (error) {
      console.error('Error saving search:', error)
    }
  }
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Construct query params for router
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedPricing) params.set('pricing', selectedPricing)
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','))
    params.set('sortBy', sortBy)
    params.set('page', '1') // Reset to first page
    
    // Update URL with new search params
    router.push(`/dashboard/search?${params.toString()}`)
  }
  
  // Handle tag selection/deselection
  const toggleTag = (tag: string) => {
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
    router.push(`/dashboard/search?${params.toString()}`)
  }
  
  // Handle pagination
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/dashboard/search?${params.toString()}`)
  }
  
  // Clear all filters
  const clearFilters = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    params.set('sortBy', 'popular')
    params.set('page', '1')
    router.push(`/dashboard/search?${params.toString()}`)
    
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
  
  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Advanced Search</h1>
          <p className="text-muted-foreground">
            Find and save your favorite SaaS tools
          </p>
        </div>
        
        <div className="flex gap-2">
          <Link href="/dashboard/favorites">
            <Button variant="outline" className="gap-2">
              <BookmarkCheck size={16} />
              My Favorites
            </Button>
          </Link>
          <Link href="/dashboard/saved-searches">
            <Button variant="outline" className="gap-2">
              <History size={16} />
              Saved Searches
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Tabs for search modes */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All SaaS</TabsTrigger>
          <TabsTrigger value="favorites">My Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {/* Search form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
                {(selectedCategory || selectedPricing || selectedTags.length > 0) && (
                  <Badge variant="secondary" className="ml-2">
                    {(selectedCategory ? 1 : 0) + 
                     (selectedPricing ? 1 : 0) + 
                     (selectedTags.length)}
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
            
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2 items-center">
                {(selectedCategory || selectedPricing || selectedTags.length > 0) && (
                  <>
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
                            router.push(`/dashboard/search?${params.toString()}`)
                          }}
                        />
                      </Badge>
                    )}
                    
                    {selectedPricing && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Pricing: {selectedPricing}
                        <X 
                          size={14} 
                          className="cursor-pointer" 
                          onClick={() => {
                            setSelectedPricing('')
                            const params = new URLSearchParams(searchParams.toString())
                            params.delete('pricing')
                            router.push(`/dashboard/search?${params.toString()}`)
                          }}
                        />
                      </Badge>
                    )}
                    
                    {selectedTags.map(tag => (
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
                            router.push(`/dashboard/search?${params.toString()}`)
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
                  </>
                )}
              </div>
              
              {/* Save search button */}
              <Dialog open={saveSearchOpen} onOpenChange={setSaveSearchOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Save size={16} />
                    Save Search
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save this search</DialogTitle>
                    <DialogDescription>
                      Save your current search criteria for quick access later.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="search-name">Search name</Label>
                        <Input
                          id="search-name"
                          placeholder="e.g., Marketing Tools for SMB"
                          value={savedSearchName}
                          onChange={(e) => setSavedSearchName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="font-medium">Current search criteria:</Label>
                        <div className="text-sm text-muted-foreground space-y-1 pl-2 border-l-2 border-muted">
                          {searchQuery && <div>Query: "{searchQuery}"</div>}
                          {selectedCategory && <div>Category: {selectedCategory}</div>}
                          {selectedPricing && <div>Pricing: {selectedPricing}</div>}
                          {selectedTags.length > 0 && (
                            <div>Tags: {selectedTags.join(', ')}</div>
                          )}
                          {!searchQuery && !selectedCategory && !selectedPricing && selectedTags.length === 0 && (
                            <div>All SaaS tools</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="alerts" 
                          checked={receiveAlerts}
                          onCheckedChange={(checked) => setReceiveAlerts(checked as boolean)}
                        />
                        <label
                          htmlFor="alerts"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Receive alerts for new matching tools
                        </label>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSaveSearchOpen(false)}>Cancel</Button>
                    <Button onClick={saveCurrentSearch}>Save Search</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Filters section */}
            {showFilters && searchResults?.filters && (
              <div className="mt-4 p-4 border rounded-lg bg-background">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium mb-2">Categories</h4>
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                      {searchResults.filters.categories.map((category: any) => (
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
                  
                  {/* Pricing Models */}
                  <div>
                    <h4 className="font-medium mb-2">Pricing Models</h4>
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
                      {searchResults.filters.pricingModels.map((pricing: any) => (
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
                  </div>
                  
                  {/* Popular Tags */}
                  <div>
                    <h4 className="font-medium mb-2">Popular Tags</h4>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                      {searchResults.filters.popularTags.map((tag: string) => (
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
                  </div>
                </div>
              </div>
            )}
          </form>

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
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.items.map((item: any) => (
                  <Card key={item.id} className="overflow-hidden flex flex-col">
                    <div className="p-4 flex-grow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
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
                        
                        {/* Favorite button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(item.id)}
                          className="h-8 w-8"
                        >
                          {favorites.includes(item.id) ? (
                            <BookmarkCheck className="h-4 w-4 text-primary" />
                          ) : (
                            <BookmarkPlus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      <p className="text-sm mb-3 line-clamp-3">
                        {item.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.tags.slice(0, 3).map((tag: string) => (
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
              
              {/* Pagination */}
              {searchResults.pagination.totalPages > 1 && (
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
        </TabsContent>
        
        <TabsContent value="favorites">
          <div className="py-10 text-center">
            <h3 className="text-lg font-semibold mb-2">Your Favorites</h3>
            <p className="text-muted-foreground">
              View and manage your favorite SaaS tools.
            </p>
            <Link href="/dashboard/favorites">
              <Button className="mt-4">Go to Favorites</Button>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="recent">
          <div className="py-10 text-center">
            <h3 className="text-lg font-semibold mb-2">Recently Viewed</h3>
            <p className="text-muted-foreground">
              See your browsing history and recently viewed tools.
            </p>
            <Link href="/dashboard/history">
              <Button className="mt-4">View History</Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

// Form schema
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  website: z.string().url('Please enter a valid URL'),
  category: z.string().min(1, 'Please select a category'),
  pricingModel: z.string().min(1, 'Please select a pricing model'),
  pricingDetails: z.string().optional(),
  tags: z.string().optional(),
  features: z.string().optional(),
  integrations: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
  logo: z.string().optional(),
  verified: z.boolean().default(false)
})

type FormValues = z.infer<typeof formSchema>

export default function EditSaaSPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      website: '',
      category: '',
      pricingModel: '',
      pricingDetails: '',
      tags: '',
      features: '',
      integrations: '',
      pros: '',
      cons: '',
      logo: '',
      verified: false
    }
  })

  // Fetch SaaS data
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin-login')
      return
    }

    if (params.id && status === 'authenticated') {
      fetchSaaSDetails()
    }
  }, [status, params.id, router])

  const fetchSaaSDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/saas/${params.id}`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const { saas } = await response.json()
      
      // Set form values
      form.reset({
        name: saas.name,
        description: saas.description,
        website: saas.website,
        category: saas.category,
        pricingModel: saas.pricingModel,
        pricingDetails: saas.pricingDetails || '',
        tags: saas.tags?.join(', ') || '',
        features: saas.features?.join(', ') || '',
        integrations: saas.integrations?.join(', ') || '',
        pros: saas.pros?.join(', ') || '',
        cons: saas.cons?.join(', ') || '',
        logo: saas.logo || '',
        verified: saas.verified
      })
    } catch (err) {
      console.error('Error fetching SaaS details:', err)
      setError('Failed to load SaaS details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Form submission
  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true)
      
      // Process arrays from comma-separated strings
      const formattedData = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        features: data.features ? data.features.split(',').map(feature => feature.trim()) : [],
        integrations: data.integrations ? data.integrations.split(',').map(integration => integration.trim()) : [],
        pros: data.pros ? data.pros.split(',').map(pro => pro.trim()) : [],
        cons: data.cons ? data.cons.split(',').map(con => con.trim()) : []
      }
      
      const response = await fetch(`/api/admin/saas/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update SaaS')
      }
      
      toast.success('SaaS updated successfully')
      router.push(`/admin/saas/${params.id}`)
    } catch (err) {
      console.error('Error updating SaaS:', err)
      toast.error('Failed to update SaaS. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-lg text-gray-700">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-4xl py-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit SaaS</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="SaaS name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL*</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description*</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Detailed description of the SaaS" 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category*</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Project Management">Project Management</SelectItem>
                      <SelectItem value="Communication">Communication</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Analytics">Analytics</SelectItem>
                      <SelectItem value="Productivity">Productivity</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="pricingModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Model*</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Free">Free</SelectItem>
                      <SelectItem value="Freemium">Freemium</SelectItem>
                      <SelectItem value="Subscription">Subscription</SelectItem>
                      <SelectItem value="One-time payment">One-time payment</SelectItem>
                      <SelectItem value="Usage-based">Usage-based</SelectItem>
                      <SelectItem value="Contact for pricing">Contact for pricing</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="pricingDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pricing Details</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Detailed information about pricing tiers, discounts, etc." 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Tag1, Tag2, Tag3" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Separate tags with commas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/logo.png" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Feature 1, Feature 2, Feature 3" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Separate features with commas</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="integrations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Integrations</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Integration 1, Integration 2, Integration 3" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Separate integrations with commas</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="pros"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pros</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Pro 1, Pro 2, Pro 3" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Separate pros with commas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cons"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cons</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Con 1, Con 2, Con 3" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Separate cons with commas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="verified"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Verified</FormLabel>
                  <FormDescription>
                    Mark this SaaS as verified to make it visible to users
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm, SubmitHandler } from 'react-hook-form'

interface SaaSSubmitFormData {
  name: string
  description: string
  website: string
  category: string
  pricingModel: string
  pricingDetails?: string
  tags: string
  features: string
  integrations: string
  pros: string
  cons: string
  logo?: string
}

export default function SaaSSubmitPage() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/login?callbackUrl=/saas/submit')
    },
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SaaSSubmitFormData>()

  const onSubmit: SubmitHandler<SaaSSubmitFormData> = async (data) => {
    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)
    
    try {
      // Format the data for API
      const formattedData = {
        ...data,
        tags: data.tags.split(',').map(tag => tag.trim()),
        features: data.features.split(',').map(feature => feature.trim()),
        integrations: data.integrations.split(',').map(integration => integration.trim()),
        pros: data.pros.split(',').map(pro => pro.trim()),
        cons: data.cons.split(',').map(con => con.trim()),
      }

      const response = await fetch('/api/saas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit SaaS')
      }

      setSuccessMessage('SaaS submitted successfully! It will be reviewed by our team before being published.')
      reset()
      
      // Redirect after a delay
      setTimeout(() => {
        router.push('/saas')
      }, 3000)
    } catch (err) {
      console.error('Error submitting SaaS:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit SaaS. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-2">Submit a SaaS Tool</h1>
            <p className="text-gray-600">
              Share a valuable SaaS tool with the community. Your contribution helps others discover useful solutions.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-8">
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                SaaS Name*
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g., Slack, Notion, Asana"
                className={`w-full px-3 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="website">
                Website URL*
              </label>
              <input
                id="website"
                type="url"
                placeholder="https://example.com"
                className={`w-full px-3 py-2 border rounded ${errors.website ? 'border-red-500' : 'border-gray-300'}`}
                {...register('website', { 
                  required: 'Website URL is required',
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/,
                    message: 'Please enter a valid URL'
                  } 
                })}
              />
              {errors.website && (
                <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description*
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe what this SaaS does and its main value proposition"
                className={`w-full px-3 py-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  Category*
                </label>
                <select
                  id="category"
                  className={`w-full px-3 py-2 border rounded ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('category', { required: 'Category is required' })}
                >
                  <option value="">Select a category</option>
                  <option value="Project Management">Project Management</option>
                  <option value="Communication">Communication</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Design">Design</option>
                  <option value="Development">Development</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Security">Security</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pricingModel">
                  Pricing Model*
                </label>
                <select
                  id="pricingModel"
                  className={`w-full px-3 py-2 border rounded ${errors.pricingModel ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('pricingModel', { required: 'Pricing model is required' })}
                >
                  <option value="">Select a pricing model</option>
                  <option value="Free">Free</option>
                  <option value="Freemium">Freemium</option>
                  <option value="Subscription">Subscription</option>
                  <option value="One-time Purchase">One-time Purchase</option>
                  <option value="Usage-based">Usage-based</option>
                  <option value="Contact for Pricing">Contact for Pricing</option>
                </select>
                {errors.pricingModel && (
                  <p className="text-red-500 text-xs mt-1">{errors.pricingModel.message}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pricingDetails">
                Pricing Details
              </label>
              <textarea
                id="pricingDetails"
                rows={2}
                placeholder="e.g., Free for up to 3 users, $10/user/month for Pro, $20/user/month for Business"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                {...register('pricingDetails')}
              />
              <p className="text-gray-500 text-xs mt-1">Optional, but helpful for others</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
                Tags*
              </label>
              <input
                id="tags"
                type="text"
                placeholder="productivity, collaboration, remote work (comma-separated)"
                className={`w-full px-3 py-2 border rounded ${errors.tags ? 'border-red-500' : 'border-gray-300'}`}
                {...register('tags', { required: 'At least one tag is required' })}
              />
              {errors.tags && (
                <p className="text-red-500 text-xs mt-1">{errors.tags.message}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">Separate with commas</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="features">
                Key Features*
              </label>
              <textarea
                id="features"
                rows={3}
                placeholder="Real-time collaboration, Document sharing, Team chat (comma-separated)"
                className={`w-full px-3 py-2 border rounded ${errors.features ? 'border-red-500' : 'border-gray-300'}`}
                {...register('features', { required: 'At least one feature is required' })}
              />
              {errors.features && (
                <p className="text-red-500 text-xs mt-1">{errors.features.message}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">Separate with commas</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="integrations">
                Integrations
              </label>
              <input
                id="integrations"
                type="text"
                placeholder="Slack, Google Drive, Zapier (comma-separated)"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                {...register('integrations')}
              />
              <p className="text-gray-500 text-xs mt-1">Separate with commas. Optional.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pros">
                  Pros*
                </label>
                <textarea
                  id="pros"
                  rows={3}
                  placeholder="User-friendly, Great customer support (comma-separated)"
                  className={`w-full px-3 py-2 border rounded ${errors.pros ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('pros', { required: 'At least one pro is required' })}
                />
                {errors.pros && (
                  <p className="text-red-500 text-xs mt-1">{errors.pros.message}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">Separate with commas</p>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cons">
                  Cons*
                </label>
                <textarea
                  id="cons"
                  rows={3}
                  placeholder="Expensive for small teams, Limited mobile app (comma-separated)"
                  className={`w-full px-3 py-2 border rounded ${errors.cons ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('cons', { required: 'At least one con is required' })}
                />
                {errors.cons && (
                  <p className="text-red-500 text-xs mt-1">{errors.cons.message}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">Separate with commas</p>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="logo">
                Logo URL
              </label>
              <input
                id="logo"
                type="url"
                placeholder="https://example.com/logo.png"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                {...register('logo')}
              />
              <p className="text-gray-500 text-xs mt-1">Optional. Direct link to the SaaS logo image.</p>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => router.push('/saas')}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-primary text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit SaaS'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-gray-600 text-sm">
            <p>Your submission will be reviewed before being published to ensure quality and accuracy.</p>
            <p className="mt-2">Thank you for contributing to the Shared Sparks community!</p>
          </div>
        </div>
      </div>
    </div>
  )
} 
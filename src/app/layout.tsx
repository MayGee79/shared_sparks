import './globals.css'
import type { Metadata } from 'next'
// Remove font import that's causing issues
// import { Inter } from 'next/font/google'
// Remove or create the Providers component
// import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'Shared Sparks',
  description: 'Connect and share software solutions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="icon" 
          href="data:image/x-icon;base64,AA"
          type="image/x-icon"
        />
      </head>
      <body style={{ 
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
        margin: 0,
        padding: 0
      }}>
        {children}
      </body>
    </html>
  )
}
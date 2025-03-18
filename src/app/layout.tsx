import './globals.css'
import type { Metadata } from 'next'
import AuthProvider from '@/components/providers/AuthProvider'

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
          href="/favicon.ico"
          type="image/x-icon"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
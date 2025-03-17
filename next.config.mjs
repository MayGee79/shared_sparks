/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add configuration for Vercel deployment
  productionBrowserSourceMaps: false,
  // Configure how Next.js handles certain files
  poweredByHeader: false,
  // Disable static optimization for pages that cause errors
  experimental: {
    // This disables prerendering for problematic pages
    disableOptimizedLoading: true
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      }
    ]
  }
};

export default nextConfig;

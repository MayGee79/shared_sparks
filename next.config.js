/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'shared-sparks-gct65o8z4-maygee79s-projects.vercel.app'],
    },
  },
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  eslint: {
    // Disabling ESLint during production builds
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 
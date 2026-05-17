import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  compress: true,
  async rewrites() {
    return process.env.NODE_ENV === 'development'
      ? [{ source: '/api-proxy/:path*', destination: 'http://localhost:3333/api/v1/:path*' }]
      : []
  },
}

export default nextConfig

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'http', hostname: 'localhost' },
    ],
    minimumCacheTTL: 60,
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Compressão
  compress: true,

  // Cabeçalhos de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },

  // Rewrite para API durante desenvolvimento
  async rewrites() {
    return process.env.NODE_ENV === 'development'
      ? [{ source: '/api-proxy/:path*', destination: 'http://localhost:3333/api/v1/:path*' }]
      : []
  },
}

export default nextConfig

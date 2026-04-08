import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ['localhost', '127.0.0.1'],
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
  },
}

export default nextConfig

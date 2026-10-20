import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Lets a build or test server use its own folder (NEXT_DIST_DIR=.next-test) without touching the one a running
  // `next dev` is using.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  reactCompiler: true,
  allowedDevOrigins: ['localhost', '127.0.0.1'],
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
  },
}

export default nextConfig

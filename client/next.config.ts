import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true // ✅ disables ESLint during production build
  }
}

export default nextConfig

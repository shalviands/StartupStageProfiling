/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for @react-pdf/renderer
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
    }
    return config
  },

  // Required for xlsx (SheetJS) — avoids critical dependency warning in Next 14
  experimental: {
    serverComponentsExternalPackages: ['xlsx'],
  },

  // Suppress specific harmless warnings during build
  eslint: {
    ignoreDuringBuilds: false,  // Keep ESLint strict for production readiness
  },

  typescript: {
    ignoreBuildErrors: false,   // NEVER ignore TypeScript errors
  },

  images: {
    remotePatterns: [],
  },
}

export default nextConfig

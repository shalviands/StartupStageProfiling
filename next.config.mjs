/** @type {import('next').NextConfig} */
// Build manifest re-sync: 2026-04-20T18:15:55.000Z [/]
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
        config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
        encoding: false,
      }
    }
    return config
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use 'standalone' for Railway deployment with API routes
  // Use 'export' for static hosting (GitHub Pages, etc.)
  output: process.env.STATIC_EXPORT === 'true' ? 'export' : 'standalone',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  // Enable experimental features if needed
  experimental: {
    // serverComponentsExternalPackages: ['@prisma/client'],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    // Avoid SSR issues with p5.js and other browser-only libraries
    if (isServer) {
      config.externals = [...(config.externals || []), 'p5', 'd3-delaunay'];
    }
    
    // Disable cache to prevent build issues
    config.cache = false;
    
    return config;
  },
  // Add proper handling for process termination signals
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Set trailingSlash to true for Netlify to properly serve static files
  trailingSlash: true,
};

module.exports = nextConfig;
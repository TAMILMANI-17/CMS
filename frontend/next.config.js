/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*',
      },
    ];
  },
  // Next.js 16 optimizations
  experimental: {
    optimizePackageImports: ['@reduxjs/toolkit', 'react-redux'],
  },
};

module.exports = nextConfig;


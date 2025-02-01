/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['lgnhyalofrohkfjbisvk.supabase.co', 'placehold.co']
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;

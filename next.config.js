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
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    PASSWORD_SALT: process.env.PASSWORD_SALT,
  },
};

module.exports = nextConfig;

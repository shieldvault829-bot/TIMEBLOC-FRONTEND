// next.config.js
/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'avatars.githubusercontent.com',
      'pbs.twimg.com',
      'abs.twimg.com',
      'images.unsplash.com',
      'source.unsplash.com'
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  env: {
    NEXT_PUBLIC_ENVIRONMENT: process.env.NODE_ENV || 'production',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  
  experimental: {
    scrollRestoration: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
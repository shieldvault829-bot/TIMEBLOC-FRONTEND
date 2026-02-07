// next.config.js - ULTIMATE SECURITY & OPTIMIZATION
/** @type {import('next').NextConfig} */

// Get environment for conditional config
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig = {
  // ====================
  // SECURITY CONFIGURATION
  // ====================
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  images: {
    domains: [
      'your-supabase-storage-url.com',
      '*.supabase.co',
      '*.supabase.in',
      'api.nowpayments.io',
      'nowpayments.io',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'avatars.githubusercontent.com',
      'pbs.twimg.com',
      'abs.twimg.com',
      'images.unsplash.com',
      'source.unsplash.com'
    ].filter(Boolean),
    
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**',
      },
    ],
  },
  
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
    NEXT_PUBLIC_ENVIRONMENT: process.env.NODE_ENV || 'production',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://timebloc.com',
    NEXT_PUBLIC_SECURITY_LEVEL: 'maximum',
    NEXT_PUBLIC_ENCRYPTION_ENABLED: 'true',
    NEXT_PUBLIC_SOCKET_ENABLED: 'true',
    NEXT_PUBLIC_PAYMENTS_ENABLED: 'true',
    NEXT_PUBLIC_ANALYTICS_ENABLED: isProduction ? 'true' : 'false',
  },
  
  async headers() {
    const securityHeaders = [
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on'
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload'
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()'
      },
      {
        key: 'X-Powered-By',
        value: 'TimeBloc Security'
      },
      {
        key: 'Content-Security-Policy',
        value: `
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com ${isProduction ? '' : "http://localhost:3000"};
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
          img-src 'self' data: https: blob:;
          font-src 'self' https://fonts.gstatic.com;
          connect-src 'self' https://api.nowpayments.io https://*.railway.app wss://*.railway.app ${isDevelopment ? "ws://localhost:3001" : ""};
          frame-src 'self' https://nowpayments.io;
          media-src 'self';
          object-src 'none';
          base-uri 'self';
          form-action 'self';
          frame-ancestors 'none';
          block-all-mixed-content;
          upgrade-insecure-requests;
        `.replace(/\s+/g, ' ').trim()
      }
    ];
    
    const developmentHeaders = [
      {
        key: 'Content-Security-Policy',
        value: `
          default-src 'self' http://localhost:3000;
          script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000;
          style-src 'self' 'unsafe-inline' http://localhost:3000 https://fonts.googleapis.com;
          img-src 'self' data: https: http:;
          font-src 'self' https://fonts.gstatic.com;
          connect-src 'self' http://localhost:3001 ws://localhost:3001 https://api.nowpayments.io;
          frame-src 'self' http://localhost:3000 https://nowpayments.io;
        `.replace(/\s+/g, ' ').trim()
      }
    ];
    
    return [
      {
        source: '/(.*)',
        headers: isProduction ? securityHeaders : developmentHeaders,
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
  
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.devtool = 'hidden-source-map';
    }
    
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              return match ? `npm.${match[1].replace('@', '')}` : null;
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
        },
      },
    };
    
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true,
        })
      );
    }
    
    return config;
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  experimental: {
    scrollRestoration: true,
    legacyBrowsers: false,
    browsersListForSwc: true,
    newNextLinkBehavior: true,
    optimizeCss: false,
    swcFileReading: false,
    workerThreads: false,
    cpus: 4,
    sharedPool: true,
    optimizeServerReact: true,
    
    outputFileTracingRoot: process.env.NODE_ENV === 'production' ? __dirname : undefined,
    
    turbo: isDevelopment ? {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    } : undefined,
  },
  
  output: 'standalone',
  distDir: '.next',
  cleanDistDir: true,
  
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
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/auth/login',
        permanent: false,
      },
      {
        source: '/register',
        destination: '/auth/register',
        permanent: false,
      },
      {
        source: '/premium',
        destination: '/#premium',
        permanent: false,
      },
    ];
  },
  
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const needsRewrite = isDevelopment || 
                        (backendUrl && !backendUrl.includes('localhost:3000'));
    
    if (needsRewrite) {
      return [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
        {
          source: '/socket.io/:path*',
          destination: `${backendUrl}/socket.io/:path*`,
        },
      ];
    }
    
    return [];
  },
  
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  
  trailingSlash: false,
  
  pageExtensions: ['jsx', 'js', 'tsx', 'ts'],
  
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
};

if (process.env.EXPERIMENTAL_MODULE_FEDERATION === 'true') {
  nextConfig.experimental.externalDir = true;
}

module.exports = nextConfig;
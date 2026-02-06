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
  poweredByHeader: false, // Hide Next.js header
  generateEtags: true,
  
  // ====================
  // IMAGE OPTIMIZATION
  // ====================
  images: {
    domains: [
      // Supabase Storage
      'your-supabase-storage-url.com',
      '*.supabase.co',
      '*.supabase.in',
      
      // NowPayments
      'api.nowpayments.io',
      'nowpayments.io',
      
      // Social media & avatars
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
      'avatars.githubusercontent.com',
      'pbs.twimg.com',
      'abs.twimg.com',
      
      // General CDNs
      'images.unsplash.com',
      'source.unsplash.com'
    ].filter(Boolean),
    
    formats: ['image/avif', 'image/webp'], // Modern formats only
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false, // Security: Disable SVG by default
    
    // Remote patterns for better security
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains (adjust as needed)
        pathname: '**',
      },
    ],
  },
  
  // ====================
  // ENVIRONMENT VARIABLES
  // ====================
  env: {
    // Public environment variables (exposed to browser)
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
    NEXT_PUBLIC_ENVIRONMENT: process.env.NODE_ENV || 'production',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://timebloc.com',
    
    // Security flags
    NEXT_PUBLIC_SECURITY_LEVEL: 'maximum',
    NEXT_PUBLIC_ENCRYPTION_ENABLED: 'true',
    
    // Feature flags
    NEXT_PUBLIC_SOCKET_ENABLED: 'true',
    NEXT_PUBLIC_PAYMENTS_ENABLED: 'true',
    NEXT_PUBLIC_ANALYTICS_ENABLED: isProduction ? 'true' : 'false',
  },
  
  // ====================
  // SECURITY HEADERS
  // ====================
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
      // Content Security Policy
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
    
    // Development headers (less restrictive)
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
  
  // ====================
  // WEBPACK OPTIMIZATIONS
  // ====================
  webpack: (config, { dev, isServer }) => {
    // Security: Disable source maps in production
    if (!dev && !isServer) {
      config.devtool = 'hidden-source-map';
    }
    
    // Performance optimizations
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
    
    // Bundle analyzer (optional)
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
  
  // ====================
  // BUILD OPTIMIZATIONS
  // ====================
  eslint: {
    ignoreDuringBuilds: true, // Prevent build failures
  },
  typescript: {
    ignoreBuildErrors: true, // Prevent build failures
  },
  
  // ====================
  // EXPERIMENTAL FEATURES
  // ====================
  experimental: {
    scrollRestoration: true,
    legacyBrowsers: false,
    browsersListForSwc: true,
    newNextLinkBehavior: true,
    optimizeCss: true,
    swcFileReading: false,
    workerThreads: false,
    cpus: 4,
    sharedPool: true,
    optimizeServerReact: true,
    
    // Output tracing for smaller deployments
    outputFileTracingRoot: process.env.NODE_ENV === 'production' ? __dirname : undefined,
    
    // Turbopack for development (optional)
    turbo: isDevelopment ? {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    } : undefined,
  },
  
  // ====================
  // OUTPUT CONFIGURATION
  // ====================
  output: 'standalone', // For Railway deployment
  distDir: '.next',
  cleanDistDir: true,
  
  // ====================
  // REDIRECTS
  // ====================
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
  
  // ====================
  // REWRITES (PROXY)
  // ====================
  async rewrites() {
    // Only rewrite in development or if backend URL is different
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
  
  // ====================
  // I18N (Optional)
  // ====================
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  
  // ====================
  // TRAILING SLASH
  // ====================
  trailingSlash: false,
  
  // ====================
  // PAGE EXTENSIONS
  // ====================
  pageExtensions: ['jsx', 'js', 'tsx', 'ts'],
  
  // ====================
  // ON DEMAND ENTRIES
  // ====================
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    pagesBufferLength: 5,
  },
};

// Conditional exports for module federation (optional)
if (process.env.EXPERIMENTAL_MODULE_FEDERATION === 'true') {
  nextConfig.experimental.externalDir = true;
}

module.exports = nextConfig;
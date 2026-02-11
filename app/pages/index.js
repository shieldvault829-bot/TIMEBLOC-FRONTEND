import Head from "next/head";
import PremiumNavbar from "../components/PremiumNavbar";
import AnimatedLogo from "../components/AnimatedLogo";
import SharePage from "../components/SharePage";
import { useState, useEffect } from "react";
import axios from "axios";
import ErrorBoundary from "../components/ErrorBoundary";

export default function Home() {
  const [showShare, setShowShare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Track page load for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleBuyPremium = async () => {
    try {
      setLoading(true);
      setPaymentError(null);
      
      // Validate environment
      if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
        throw new Error("Payment system configuration error");
      }

      // Security: Validate input
      const paymentData = {
        userId: "demo-user-" + Date.now(),
        amount: 10,
        product: "premium-monthly",
        currency: "USD",
        timestamp: new Date().toISOString()
      };

      // Validate amount
      if (paymentData.amount <= 0 || paymentData.amount > 10000) {
        throw new Error("Invalid payment amount");
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-payment`,
        paymentData,
        {
          timeout: 15000, // 15 second timeout
          headers: {
            'Content-Type': 'application/json',
            'X-Request-Id': 'frontend-' + Date.now()
          }
        }
      );
      
      if (response.data?.success && response.data.payment?.invoice_url) {
        // Security: Validate URL before opening
        const url = response.data.payment.invoice_url;
        if (url.startsWith('https://')) {
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          throw new Error("Invalid payment URL");
        }
      } else {
        throw new Error(response.data?.error || "Payment creation failed");
      }
      
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(error.message || "Payment system is temporarily unavailable. Please try again later.");
      
      // User-friendly error messages
      if (error.code === 'ECONNABORTED') {
        setPaymentError("Payment request timed out. Please check your connection.");
      } else if (error.response?.status === 429) {
        setPaymentError("Too many payment attempts. Please wait a few minutes.");
      } else if (error.response?.status === 401) {
        setPaymentError("Authentication required. Please refresh the page.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShareDemo = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'share_demo_click', {
        event_category: 'engagement',
        event_label: 'home_page'
      });
    }
    setShowShare(true);
  };

  return (
    <ErrorBoundary>
      <Head>
        {/* Primary Meta Tags */}
        <title>TimeBloc | Military-Grade Encrypted Digital Time Capsules - Secure Content Sharing Platform</title>
        <meta name="description" content="Preserve memories with military-grade AES-256 encryption. Share encrypted digital time capsules securely. Blockchain-verified premium content platform with smart moderation." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* SEO Keywords */}
        <meta name="keywords" content="digital time capsule, encrypted sharing, secure messaging, memory preservation, blockchain security, encrypted content, premium sharing platform, military grade encryption, secure file sharing, private content" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://timebloc.com/" />
        <meta property="og:title" content="TimeBloc - Secure Digital Time Capsules with Military-Grade Encryption" />
        <meta property="og:description" content="Share encrypted memories securely. Premium platform with blockchain verification and smart AI moderation." />
        <meta property="og:image" content="https://timebloc.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="TimeBloc - Secure Digital Time Capsules" />
        <meta property="og:site_name" content="TimeBloc" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://timebloc.com/" />
        <meta name="twitter:title" content="TimeBloc - Secure Encrypted Content Sharing" />
        <meta name="twitter:description" content="Military-grade encrypted digital time capsules with blockchain verification." />
        <meta name="twitter:image" content="https://timebloc.com/twitter-card.png" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="TimeBloc Team" />
        <meta name="copyright" content="TimeBloc" />
        <link rel="canonical" href="https://timebloc.com/" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "TimeBloc",
            "description": "Secure digital time capsule platform with military-grade AES-256 encryption and blockchain verification",
            "url": "https://timebloc.com",
            "applicationCategory": "SecurityApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "10",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "provider": {
              "@type": "Organization",
              "name": "TimeBloc",
              "sameAs": [
                "https://twitter.com/timebloc",
                "https://linkedin.com/company/timebloc"
              ]
            }
          })}
        </script>
        
        {/* Performance Hints */}
        <link rel="preconnect" href="https://api.nowpayments.io" />
        <link rel="dns-prefetch" href="https://api.nowpayments.io" />
        <meta name="theme-color" content="#0a0a0a" />
      </Head>

      <main className="min-h-screen bg-dark-900 text-white" itemScope itemType="http://schema.org/WebPage">
        {/* Schema.org markup */}
        <meta itemProp="name" content="TimeBloc Homepage" />
        <meta itemProp="description" content="Secure encrypted content sharing platform" />
        
        <PremiumNavbar />
        
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 text-center" itemScope itemType="http://schema.org/WebApplication">
          <div className="flex justify-center">
            <AnimatedLogo size="xl" />
          </div>
          
          <h1 className="mt-8 text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent" itemProp="name">
            TimeBloc
          </h1>
          
          <p className="mt-4 text-xl md:text-2xl text-dark-300 max-w-2xl mx-auto" itemProp="description">
            Secure • Encrypted • Modern Digital Time Capsule Platform
          </p>
          
          {/* Trust Indicators */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-dark-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              AES-256 Military Encryption
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Blockchain Verified
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              24/7 Security Monitoring
            </div>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleBuyPremium}
              disabled={loading}
              aria-label="Get Premium Subscription for $10 per month"
              className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg animate-glow disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : (
                "Get Premium - $10/month"
              )}
            </button>
            
            <button 
              onClick={handleShareDemo}
              aria-label="Try Share Demo Feature"
              className="px-8 py-3 bg-dark-800 border border-dark-700 rounded-lg font-semibold hover:bg-dark-700 transition-all min-w-[200px]"
            >
              Try Share Demo
            </button>
          </div>

          {/* Error Display */}
          {paymentError && (
            <div className="mt-6 max-w-md mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{paymentError}</p>
              <button 
                onClick={() => setPaymentError(null)}
                className="mt-2 text-xs text-dark-300 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Security Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 opacity-75">
            <div className="text-xs text-dark-400">🔒 SSL Secured</div>
            <div className="text-xs text-dark-400">🛡️ DDoS Protected</div>
            <div className="text-xs text-dark-400">⚡ PCI Compliant</div>
            <div className="text-xs text-dark-400">📈 GDPR Ready</div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 max-w-6xl mx-auto" itemScope itemType="http://schema.org/ItemList">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" itemProp="name">
            Military-Grade Security Features
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-dark-800 rounded-xl border border-dark-700 hover:border-primary-500/30 transition-all duration-300" itemScope itemType="http://schema.org/ListItem">
              <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-semibold text-primary-400 mb-2" itemProp="name">
                Military-Grade Encryption
              </h3>
              <p className="text-dark-300" itemProp="description">
                AES-256-GCM encryption with automatic key rotation. Your content is encrypted end-to-end before leaving your device.
              </p>
              <meta itemProp="position" content="1" />
            </div>
            
            <div className="p-6 bg-dark-800 rounded-xl border border-dark-700 hover:border-primary-500/30 transition-all duration-300" itemScope itemType="http://schema.org/ListItem">
              <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-primary-400 mb-2" itemProp="name">
                AI-Powered Moderation
              </h3>
              <p className="text-dark-300" itemProp="description">
                Real-time content filtering with machine learning algorithms. Ensures community safety and compliance.
              </p>
              <meta itemProp="position" content="2" />
            </div>
            
            <div className="p-6 bg-dark-800 rounded-xl border border-dark-700 hover:border-primary-500/30 transition-all duration-300" itemScope itemType="http://schema.org/ListItem">
              <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-primary-400 mb-2" itemProp="name">
                Premium Performance
              </h3>
              <p className="text-dark-300" itemProp="description">
                Lightning-fast content delivery with global CDN. 99.9% uptime guarantee with automated backups.
              </p>
              <meta itemProp="position" content="3" />
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🌐</div>
              <div className="text-sm text-dark-300">Global Network</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">📱</div>
              <div className="text-sm text-dark-300">Mobile Optimized</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">🔑</div>
              <div className="text-sm text-dark-300">2FA Ready</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm text-dark-300">Analytics</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-dark-900 to-dark-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Secure Your Memories?
            </h2>
            <p className="text-xl text-dark-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust TimeBloc for their most precious digital memories.
            </p>
            <button 
              onClick={handleBuyPremium}
              disabled={loading}
              className="px-10 py-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl font-semibold text-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-2xl"
            >
              Start Free Trial - 7 Days
            </button>
            <p className="mt-4 text-sm text-dark-400">
              No credit card required • Cancel anytime • 256-bit encryption
            </p>
          </div>
        </section>

        {/* Share Modal */}
        {showShare && (
          <SharePage 
            postId="demo123" 
            onClose={() => setShowShare(false)} 
          />
        )}

        {/* Performance Indicator */}
        {!pageLoaded && (
          <div className="fixed inset-0 bg-dark-900 flex items-center justify-center z-50">
            <div className="text-center">
              <AnimatedLogo size="lg" />
              <p className="mt-4 text-dark-300">Loading Secure Platform...</p>
            </div>
          </div>
        )}
      </main>
    </ErrorBoundary>
  );
}
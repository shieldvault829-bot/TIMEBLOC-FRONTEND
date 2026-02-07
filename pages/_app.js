import "../styles/globals.css";
import ErrorBoundary from "../components/ErrorBoundary";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSocket } from "../lib/socket";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket when user logs in
    const initializeSocket = async () => {
      try {
        // Get token from localStorage or cookies
        const token = localStorage.getItem('token') || 
                     document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        
        if (token) {
          const socketClient = getSocket();
          const connected = socketClient.connect(token);
          
          if (connected) {
            setSocket(socketClient);
            
            // Listen for payment notifications
            socketClient.on('payment_verified', (data) => {
              console.log('Payment verified via socket:', data);
              
              // Show success notification
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('payment-success', { 
                  detail: data 
                }));
              }
            });
            
            // Heartbeat interval
            const heartbeatInterval = setInterval(() => {
              socketClient.sendHeartbeat();
            }, 25000); // Every 25 seconds
            
            return () => clearInterval(heartbeatInterval);
          }
        }
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    };

    initializeSocket();

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [router.pathname]);

  // Track page views
  useEffect(() => {
    const handleRouteChange = (url) => {
      // Security logging
      console.log(`Route change: ${url}`);
      
      // Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'G-XXXXXXXXXX', {
          page_path: url,
        });
      }
      
      // Emit page view to socket
      if (socket && socket.getStatus().connected) {
        socket.emit('page-view', {
          path: url,
          timestamp: new Date().toISOString()
        });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, socket]);

  return (
    <>
      <Head>
        {/* Global Meta Tags */}
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        
        {/* Security Headers */}
        <meta httpEquiv="Content-Security-Policy" content={`
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com https://vercel.live;
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
          img-src 'self' data: https: blob:;
          font-src 'self' https://fonts.gstatic.com;
          connect-src 'self' https://api.nowpayments.io https://your-app-name.railway.app wss://your-app-name.railway.app https://www.google-analytics.com;
          frame-src 'self' https://nowpayments.io;
          media-src 'self';
          object-src 'none';
          base-uri 'self';
          form-action 'self';
          frame-ancestors 'none';
          block-all-mixed-content;
          upgrade-insecure-requests;
        `.replace(/\s+/g, ' ')} />
        
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" />
      </Head>

      <ErrorBoundary>
        {/* Pass socket to pages via pageProps */}
        <Component {...pageProps} socket={socket} />
        
        {/* Global socket status indicator */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`w-3 h-3 rounded-full ${socket?.getStatus()?.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} 
               title={socket?.getStatus()?.connected ? 'Real-time connected' : 'Real-time disconnected'} />
        </div>
      </ErrorBoundary>
    </>
  );
}
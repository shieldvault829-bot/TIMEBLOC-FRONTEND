'use client';

import React, { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    console.error('ErrorBoundary caught error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Send to error tracking (Sentry/LogRocket)
    if (typeof window !== 'undefined' && window._errTrack) {
      window._errTrack(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center animate-pulse">
                  <FiAlertTriangle className="w-12 h-12 text-red-500" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping"></div>
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h1>
            
            <p className="text-dark-300 mb-6">
              We apologize for the inconvenience. Our team has been notified.
            </p>

            {/* Error Details (Dev only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-dark-800 rounded-lg text-left">
                <details className="text-sm">
                  <summary className="cursor-pointer text-primary-400 mb-2">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs text-dark-400 overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors"
              >
                <FiRefreshCw className="w-5 h-5" />
                Try Again
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg font-medium transition-colors"
              >
                <FiHome className="w-5 h-5" />
                Go to Home
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-8 pt-6 border-t border-dark-800">
              <p className="text-sm text-dark-400">
                Need help?{' '}
                <a 
                  href="mailto:support@timebloc.com"
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher Order Component for specific pages
export const withErrorBoundary = (WrappedComponent) => {
  return class extends Component {
    render() {
      return (
        <ErrorBoundary>
          <WrappedComponent {...this.props} />
        </ErrorBoundary>
      );
    }
  };
};

export default ErrorBoundary;
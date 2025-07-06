import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
          <div className="max-w-lg w-full bg-gray-800 rounded-lg shadow-xl p-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-400 mr-3" />
              <h1 className="text-xl font-semibold text-white">
                Something went wrong
              </h1>
            </div>
            
            <p className="text-gray-300 mb-6">
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>

            <div className="flex flex-col space-y-3">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Reload Page
              </button>
            </div>

            {/* Show error details in development */}
            {import.meta.env.DEV && this.props.showDetails && this.state.error && (
              <details className="mt-6">
                <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                  Error Details (Development Only)
                </summary>
                <div className="mt-3 p-3 bg-gray-700 rounded text-xs text-red-300 overflow-auto">
                  <div className="font-semibold mb-2">Error:</div>
                  <pre className="whitespace-pre-wrap">{this.state.error.toString()}</pre>
                  
                  {this.state.errorInfo && (
                    <>
                      <div className="font-semibold mt-3 mb-2">Component Stack:</div>
                      <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Hook for error boundary (requires react-error-boundary package for full functionality)
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: ErrorInfo) => {
    // In a real implementation, you might throw the error to be caught by an error boundary
    // or send it to an error reporting service
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // For now, we'll just log it. In production, you might want to:
    // 1. Send to error tracking service (Sentry, Bugsnag, etc.)
    // 2. Show user-friendly error message
    // 3. Attempt recovery if possible
  };
}; 
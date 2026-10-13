import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-[250px] w-full flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-200 rounded-2xl text-center my-6">
          <div className="w-12 h-12 rounded-full bg-red/10 text-red flex items-center justify-center text-xl font-bold mb-3">
            !
          </div>
          <h3 className="text-lg font-heading font-bold text-gray-900 mb-1">
            {this.props.title || 'Something went wrong loading this section'}
          </h3>
          <p className="text-xs text-gray-500 font-body max-w-md mb-4">
            We encountered a temporary display issue. The rest of the page remains fully accessible.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red text-white text-xs font-accent font-semibold rounded-lg hover:bg-red-hover transition-colors shadow"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

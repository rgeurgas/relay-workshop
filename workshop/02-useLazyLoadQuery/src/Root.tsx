import React from 'react';

import Providers from './Providers';
import App from './App';
import Loading from './Loading';

/**
 * Interface for Errors
 */
interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Default error boundary Component
 */
export class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback: (error: Error) => any;
  },
  ErrorBoundaryState
  > {
  state: ErrorBoundaryState = {
    error: null,
  };

  componentDidCatch(error: Error) {
    this.setState({ error: error });
  }

  render() {
    const { children, fallback } = this.props;
    const { error } = this.state;

    if (error) {
      return React.createElement(fallback, error);
    }

    return children;
  }
}

const Root = () => {
  return (
    <Providers>
      <ErrorBoundary fallback={(err) => `Error: ${err.message}: ${err.stack}`}>
        <React.Suspense fallback={Loading()}>
          <App />
        </React.Suspense>
      </ErrorBoundary>
    </Providers>
  );
};

export default Root;

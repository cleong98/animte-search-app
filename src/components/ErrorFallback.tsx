interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl max-w-md">
        <div className="card-body">
          <h2 className="card-title text-error">
            ⚠️ Something went wrong
          </h2>

          <p className="text-sm text-gray-600">
            An unexpected error occurred. This has been logged.
          </p>

          {/* Show error details in dev mode */}
          {import.meta.env.DEV && (
            <div className="bg-base-200 p-4 rounded mt-4">
              <p className="text-xs font-mono text-error">
                {error.message}
              </p>
              <pre className="text-xs mt-2 overflow-auto max-h-40">
                {error.stack}
              </pre>
            </div>
          )}

          <div className="card-actions justify-end mt-4">
            <button
              className="btn btn-primary"
              onClick={resetErrorBoundary}
            >
              Try Again
            </button>

            <button
              className="btn btn-ghost"
              onClick={() => window.location.href = '/'}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback;

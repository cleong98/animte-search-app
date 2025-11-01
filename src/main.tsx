import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import { store } from "./store";
import "./index.css";
import App from "./App.tsx";
import ErrorFallback from "./components/ErrorFallback";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset app state and reload
        window.location.href = '/';
      }}
      onError={(error, errorInfo) => {
        // Log errors for debugging
        console.error('Error Boundary caught:', error, errorInfo);

        // TODO: Send to error tracking service (e.g., Sentry)
        // logErrorToService(error, errorInfo);
      }}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </StrictMode>
);

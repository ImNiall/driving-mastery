import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ClerkProviderSimple from './components/auth/ClerkProviderSimple';
import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<div className="p-6 m-6 bg-red-50 border border-red-200 rounded">The app encountered a critical error. Please reload the page.</div>}>
      <ClerkProviderSimple>
        <App />
      </ClerkProviderSimple>
    </ErrorBoundary>
  </React.StrictMode>,
);

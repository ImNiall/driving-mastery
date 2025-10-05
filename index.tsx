import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthProvider from './src/providers/AuthProvider';

// Ensure no stale service workers cache old bundles (e.g., Clerk scripts)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

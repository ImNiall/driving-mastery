import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Allow overriding the Clerk Frontend API host via env to avoid any lingering custom domain config
const FRONTEND_API = (import.meta as any).env?.VITE_CLERK_FRONTEND_API as string | undefined;

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={(import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY as string}
      clerkJSUrl="https://cdn.jsdelivr.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js"
      frontendApi={FRONTEND_API}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);

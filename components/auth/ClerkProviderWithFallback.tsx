import React, { useState, useEffect } from 'react';
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';

// Get the publishable key from environment variables
let publishableKey = '';

// Try to get the key from various sources
try {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore - Vite env
    publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  } else if (typeof process !== 'undefined' && process.env) {
    publishableKey = process.env.VITE_CLERK_PUBLISHABLE_KEY || '';
  } else if (typeof window !== 'undefined') {
    publishableKey = (window as any).ENV_VITE_CLERK_PUBLISHABLE_KEY || '';
  }

  // Log the key format (first 8 chars only) for debugging
  if (publishableKey) {
    console.log(`Clerk key format check: ${publishableKey.substring(0, 8)}...`);
  } else {
    console.warn('No Clerk publishable key found');
  }
} catch (err) {
  console.error('Error accessing Clerk publishable key:', err);
}

interface ClerkProviderWithFallbackProps {
  children: React.ReactNode;
}

export default function ClerkProviderWithFallback({ children }: ClerkProviderWithFallbackProps) {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for Clerk configuration issues
    if (!publishableKey) {
      console.error('No Clerk publishable key found in environment variables');
      setError(new Error('Missing Clerk configuration'));
      setIsLoading(false);
      return;
    }

    // Validate key format
    if (!publishableKey.startsWith('pk_')) {
      console.error('Invalid Clerk publishable key format (should start with pk_)');
      setError(new Error('Invalid Clerk key format'));
      setIsLoading(false);
      return;
    }

    // Log initialization attempt
    console.log(`Attempting Clerk initialization with key: ${publishableKey.substring(0, 8)}...`);
    console.log(`Current URL: ${window.location.href}`);

    // Set loading to false after a timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // If there's no publishable key, show a dev-friendly error
  if (!publishableKey) {
    return (
      <div className="p-4 bg-red-50 border border-red-300 rounded-md">
        <h2 className="text-lg font-bold text-red-700">Authentication Configuration Error</h2>
        <p className="text-red-600">
          Missing Clerk publishable key. Please check your environment variables.
        </p>
        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
          {`VITE_CLERK_PUBLISHABLE_KEY=pk_test_...`}
        </pre>
        <div className="mt-4">
          <p className="text-sm text-gray-700">Troubleshooting steps:</p>
          <ol className="list-decimal pl-5 text-sm text-gray-700 mt-2">
            <li>Check that VITE_CLERK_PUBLISHABLE_KEY is set in your .env.local file</li>
            <li>Verify the key in your Netlify environment variables</li>
            <li>Ensure your domain is added to the Clerk dashboard</li>
            <li>
              <a 
                href="/clerk-debug.html" 
                target="_blank" 
                className="text-blue-600 hover:underline"
              >
                Open Clerk debug page
              </a>
            </li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider 
      publishableKey={publishableKey}
      appearance={{
        layout: {
          logoPlacement: 'inside',
          logoImageUrl: 'https://drivingmastery.co.uk/logo.png',
          showOptionalFields: true,
          socialButtonsPlacement: 'bottom'
        },
        variables: {
          colorPrimary: '#4a6cf7',
          borderRadius: '0.375rem'
        }
      }}
    >
      <ClerkLoading>
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
          <span className="ml-3 text-gray-600">Loading authentication...</span>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        {error ? (
          <div className="p-4 bg-red-50 border border-red-300 rounded-md">
            <h2 className="text-lg font-bold text-red-700">Authentication Error</h2>
            <p className="text-red-600">{error.message}</p>
            <div className="mt-4">
              <p className="text-sm text-gray-700">Troubleshooting steps:</p>
              <ol className="list-decimal pl-5 text-sm text-gray-700 mt-2">
                <li>Check that your domain is authorized in the Clerk dashboard</li>
                <li>Verify that you're using the correct publishable key</li>
                <li>Clear your browser cache and cookies</li>
                <li>
                  <a 
                    href="/clerk-debug.html" 
                    target="_blank" 
                    className="text-blue-600 hover:underline"
                  >
                    Open Clerk debug page
                  </a>
                </li>
              </ol>
            </div>
          </div>
        ) : (
          children
        )}
      </ClerkLoaded>
    </ClerkProvider>
  );
}

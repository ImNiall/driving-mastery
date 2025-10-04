import React, { useState, useEffect } from 'react';
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';

// Get the publishable key from environment variables
const publishableKey = typeof process !== 'undefined' && process.env.VITE_CLERK_PUBLISHABLE_KEY || 
                     typeof window !== 'undefined' && (window as any).ENV_VITE_CLERK_PUBLISHABLE_KEY || 
                     '';

interface ClerkProviderWithFallbackProps {
  children: React.ReactNode;
}

export default function ClerkProviderWithFallback({ children }: ClerkProviderWithFallbackProps) {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Log the publishable key (first 8 chars only) for debugging
    if (publishableKey) {
      console.log(`Clerk initialized with key starting with: ${publishableKey.substring(0, 8)}...`);
    } else {
      console.error('No Clerk publishable key found in environment variables');
      setError(new Error('Missing Clerk configuration'));
    }

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
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
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
          </div>
        ) : (
          children
        )}
      </ClerkLoaded>
    </ClerkProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';

interface ClerkProviderAlternativeProps {
  children: React.ReactNode;
}

export default function ClerkProviderAlternative({ children }: ClerkProviderAlternativeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [publishableKey, setPublishableKey] = useState<string>('');

  useEffect(() => {
    // Try multiple ways to get the publishable key
    const getPublishableKey = async () => {
      try {
        // Try window object first (from env-config.js)
        if (typeof window !== 'undefined' && (window as any).ENV_VITE_CLERK_PUBLISHABLE_KEY) {
          setPublishableKey((window as any).ENV_VITE_CLERK_PUBLISHABLE_KEY);
          console.log('Using Clerk key from window object');
          return;
        }

        // Try to fetch from a dedicated endpoint
        try {
          const response = await fetch('/api/clerk-key');
          if (response.ok) {
            const data = await response.json();
            if (data.publishableKey) {
              setPublishableKey(data.publishableKey);
              console.log('Using Clerk key from API endpoint');
              return;
            }
          }
        } catch (fetchError) {
          console.warn('Failed to fetch Clerk key from API:', fetchError);
        }

        // Hardcoded fallback for development
        if (process.env.NODE_ENV === 'development') {
          setPublishableKey('pk_live_Y291cnQtc3BhcnJvdy0xNS5jbGVyay5hY2NvdW50cy5kZXYk');
          console.log('Using hardcoded development Clerk key');
          return;
        }

        // If we get here, we couldn't find a key
        throw new Error('Could not find Clerk publishable key');
      } catch (err) {
        console.error('Error getting Clerk publishable key:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    getPublishableKey();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
        <span className="ml-3 text-gray-600">Loading authentication...</span>
      </div>
    );
  }

  if (error || !publishableKey) {
    return (
      <div className="p-4 bg-red-50 border border-red-300 rounded-md">
        <h2 className="text-lg font-bold text-red-700">Authentication Configuration Error</h2>
        <p className="text-red-600">
          {error ? error.message : 'Missing Clerk publishable key'}
        </p>
        <div className="mt-4">
          <p className="text-sm text-gray-700">Troubleshooting steps:</p>
          <ol className="list-decimal pl-5 text-sm text-gray-700 mt-2">
            <li>Check that VITE_CLERK_PUBLISHABLE_KEY is set in your .env.local file</li>
            <li>Verify the key in your Netlify environment variables</li>
            <li>Ensure your domain is added to the Clerk dashboard</li>
            <li>
              <a 
                href="/clerk-test.html" 
                target="_blank" 
                className="text-blue-600 hover:underline"
              >
                Try the direct Clerk test page
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
        variables: {
          colorPrimary: '#4a6cf7',
          borderRadius: '0.375rem'
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}

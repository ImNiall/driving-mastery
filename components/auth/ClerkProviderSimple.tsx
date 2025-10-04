import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';

// Get the publishable key from environment variables
// This follows the exact recommendation from ChatGPT
const pk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

interface ClerkProviderSimpleProps {
  children: React.ReactNode;
}

export default function ClerkProviderSimple({ children }: ClerkProviderSimpleProps) {
  // If there's no publishable key, show a dev-friendly error
  if (!pk) {
    return (
      <div className="p-4 bg-red-50 border border-red-300 rounded-md">
        <h2 className="text-lg font-bold text-red-700">Authentication Configuration Error</h2>
        <p className="text-red-600">
          Missing Clerk publishable key. Please check your environment variables.
        </p>
        <div className="mt-4">
          <p className="text-sm text-gray-700">Troubleshooting steps:</p>
          <ol className="list-decimal pl-5 text-sm text-gray-700 mt-2">
            <li>Set VITE_CLERK_PUBLISHABLE_KEY in your Netlify environment variables</li>
            <li>Make sure it matches your Clerk instance type (pk_test_* for dev, pk_live_* for prod)</li>
            <li>Add your site's origin to Authorized JavaScript Origins in Clerk dashboard</li>
            <li>
              <a 
                href="/clerk-instance-check.html" 
                target="_blank" 
                className="text-blue-600 hover:underline"
              >
                Run Clerk instance check
              </a>
            </li>
          </ol>
        </div>
      </div>
    );
  }

  // Simple ClerkProvider with only the publishable key
  // No frontendApi or other configuration that might cause issues
  return (
    <ClerkProvider publishableKey={pk}>
      {children}
    </ClerkProvider>
  );
}

import { ClerkProvider } from '@clerk/clerk-react';
import { PropsWithChildren } from 'react';

// Access environment variables safely with type assertion
const pk = (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY as string;

export default function ClerkAppProvider({ children }: PropsWithChildren) {
  if (!pk) console.warn('Missing VITE_CLERK_PUBLISHABLE_KEY');
  
  // Pass only the publishableKey; do not specify frontendApi/domain
  return (
    <ClerkProvider publishableKey={pk}>{children}</ClerkProvider>
  );

}

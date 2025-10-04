import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';
import { PropsWithChildren } from 'react';

// Access environment variables safely with type assertion
const pk = (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY as string;

export default function ClerkAppProvider({ children }: PropsWithChildren) {
  if (!pk) console.warn('Missing VITE_CLERK_PUBLISHABLE_KEY');

  return (
    <ClerkProvider publishableKey={pk}>
      <ClerkLoading>
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
          Loading…
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        {children}
      </ClerkLoaded>
    </ClerkProvider>
  );
}

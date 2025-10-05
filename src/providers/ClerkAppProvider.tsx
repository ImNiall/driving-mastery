import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';
import { PropsWithChildren } from 'react';

// Access environment variables safely with type assertion
const pk = (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY as string;
const frontendApi = (import.meta as any).env?.VITE_CLERK_FRONTEND_API as string | undefined; // e.g. "clerk.drivingmastery.co.uk"

export default function ClerkAppProvider({ children }: PropsWithChildren) {
  if (!pk) console.warn('Missing VITE_CLERK_PUBLISHABLE_KEY');

  // Build props conditionally to allow temporary host override via env
  const props = frontendApi ? { publishableKey: pk, frontendApi } : { publishableKey: pk };

  return (
    <ClerkProvider {...props}>
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

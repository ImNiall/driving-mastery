import { ClerkProvider } from '@clerk/clerk-react';
import { PropsWithChildren } from 'react';

// Access environment variables safely with type assertion
const pk = (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY as string;
const frontendApi = (import.meta as any).env?.VITE_CLERK_FRONTEND_API as string | undefined;

export default function ClerkAppProvider({ children }: PropsWithChildren) {
  if (!pk) console.warn('Missing VITE_CLERK_PUBLISHABLE_KEY');
  
  // Use frontendApi if available
  return frontendApi ? 
    <ClerkProvider publishableKey={pk} frontendApi={frontendApi}>{children}</ClerkProvider> :
    <ClerkProvider publishableKey={pk}>{children}</ClerkProvider>;

}

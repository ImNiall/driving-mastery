import React from 'react';
import { verifySupabaseSetup } from '../services/checkSupabaseSetup';
import { useAuth } from '@clerk/clerk-react';

const SupabaseDiagnostic: React.FC = () => {
  const { userId } = useAuth();
  const [status, setStatus] = React.useState<{
    checking: boolean;
    connected: boolean;
    tableExists: boolean;
    error?: string;
  }>({
    checking: true,
    connected: false,
    tableExists: false
  });

  React.useEffect(() => {
    const checkSetup = async () => {
      try {
        setStatus(prev => ({ ...prev, checking: true }));
        const result = await verifySupabaseSetup();
        setStatus({
          checking: false,
          ...result
        });
      } catch (err) {
        setStatus({
          checking: false,
          connected: false,
          tableExists: false,
          error: err instanceof Error ? err.message : String(err)
        });
      }
    };

    checkSetup();
  }, []);

  // Only visible in development
  if (import.meta.env.DEV !== true) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-0 bg-white border border-gray-300 p-2 text-xs z-50 w-64 opacity-80 hover:opacity-100">
      <h4 className="font-bold">Supabase Diagnostic</h4>
      <div>
        <div>Auth: {userId ? '✅ Logged in' : '❌ Not logged in'}</div>
        <div>Connection: {status.checking ? '⏳ Checking...' : status.connected ? '✅ Connected' : '❌ Failed'}</div>
        <div>Table: {status.checking ? '⏳ Checking...' : status.tableExists ? '✅ Exists' : '❌ Missing'}</div>
        {status.error && (
          <div className="text-red-500 mt-1 break-words">Error: {status.error}</div>
        )}
      </div>
    </div>
  );
};

export default SupabaseDiagnostic;

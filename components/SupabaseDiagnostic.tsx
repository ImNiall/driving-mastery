import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '../services/quizSessionService';

// Add type definition for import.meta.env
declare global {
  interface ImportMeta {
    env: Record<string, string>;
  }
}

const SupabaseDiagnostic: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, any>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        // Get environment variables
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        setDetails({
          url: supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : 'Not set',
          key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'Not set',
        });
        
        if (!supabaseUrl || !supabaseAnonKey) {
          setStatus('error');
          setError('Missing Supabase configuration. Check your environment variables.');
          return;
        }

        const supabase = getSupabaseClient();
        
        // Test connection
        const { data, error } = await supabase
          .from('quiz_sessions')
          .select('id')
          .limit(1);

        if (error) {
          console.error('[CheckSupabase] Error checking table:', error);
          setStatus('error');
          setError(`${error.message} (Code: ${error.code})`);
          setDetails(prev => ({
            ...prev,
            errorCode: error.code,
            errorDetails: error.details,
            hint: error.hint,
          }));
          return;
        }

        setStatus('ok');
        setDetails(prev => ({
          ...prev,
          connected: true,
          tableExists: true,
        }));
      } catch (err) {
        console.error('[CheckSupabase] Error checking table:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : String(err));
        setDetails(prev => ({
          ...prev,
          errorType: err instanceof Error ? err.name : 'Unknown',
          stack: err instanceof Error ? err.stack : undefined,
        }));
      }
    };

    // Only run in development or if there's a URL parameter for diagnostics
    const isDev = process.env.NODE_ENV === 'development';
    const hasDebugParam = new URLSearchParams(window.location.search).has('debug');
    
    if (isDev || hasDebugParam) {
      checkSupabase();
    } else {
      setStatus('ok'); // Skip checks in production
    }
  }, []);

  if (status === 'checking' || status === 'ok') {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-sm">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-red-800">Supabase Connection Issue</p>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-red-700 hover:text-red-900 text-xs underline"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      {error && <p className="text-red-700 mt-1">{error}</p>}
      
      {isExpanded && (
        <div className="mt-3 p-2 bg-white rounded border border-red-100 text-xs">
          <h4 className="font-semibold mb-1">Configuration</h4>
          <ul className="list-disc pl-4 space-y-1">
            <li>Supabase URL: {details.url}</li>
            <li>Anon Key: {details.key}</li>
          </ul>
          
          {details.errorCode && (
            <>
              <h4 className="font-semibold mt-2 mb-1">Error Details</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Code: {details.errorCode}</li>
                {details.errorDetails && <li>Details: {details.errorDetails}</li>}
                {details.hint && <li>Hint: {details.hint}</li>}
              </ul>
              
              <div className="mt-3 pt-2 border-t border-red-100">
                <p className="text-xs text-gray-600">Possible solutions:</p>
                <ul className="list-disc pl-4 space-y-1 text-gray-600">
                  <li>Check CORS settings in Supabase dashboard</li>
                  <li>Verify the quiz_sessions table exists</li>
                  <li>Check RLS policies on the table</li>
                  <li>Ensure environment variables are correctly set</li>
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SupabaseDiagnostic;

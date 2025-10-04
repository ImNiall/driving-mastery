// netlify/functions/clerk-key.js
exports.handler = async function(event, context) {
  // Check origin for security
  const allowedOrigins = [
    'http://localhost:5173',
    'https://driving-mastery.netlify.app',
    'https://drivingmastery.co.uk'
  ];
  
  const origin = event.headers.origin || '';
  const isAllowedOrigin = allowedOrigins.includes(origin);
  
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };
  
  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }
  
  try {
    // Get the key from environment variables
    const publishableKey = process.env.VITE_CLERK_PUBLISHABLE_KEY || 
                          'pk_live_Y291cnQtc3BhcnJvdy0xNS5jbGVyay5hY2NvdW50cy5kZXYk';
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        publishableKey
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to retrieve Clerk key'
      })
    };
  }
};

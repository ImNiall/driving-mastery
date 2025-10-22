/** @type {import('next').NextConfig} */

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdn.openai.com https://chat.openai.com",
  "connect-src 'self' https://*.supabase.co https://*.supabase.in https://api.openai.com https://chat.openai.com https://files.openai.com https://cdn.openai.com wss://api.openai.com wss://chat.openai.com",
  "img-src 'self' data:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "frame-src 'self' https://app.netlify.com https://api.openai.com https://chat.openai.com",
  "frame-ancestors 'self'"
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" }
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      // immutable static chunks
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }]
      },
      // everything else (HTML/SSR) — no-store + security headers
      {
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
          ...securityHeaders
        ]
      }
    ];
  }
};

module.exports = nextConfig;

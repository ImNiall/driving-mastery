/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';
const scriptSrc = ["'self'", "'unsafe-inline'"].concat(isDev ? ["'unsafe-eval'"] : []);
const CSP = [
  "default-src 'self'",
  `script-src ${scriptSrc.join(' ')}`,
  "connect-src 'self' https://*.supabase.co https://*.supabase.in",
  "img-src 'self' data:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "frame-src 'self'"
].join("; ");

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      { source: "/_next/static/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/assets/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/:path*", headers: [
        { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
        { key: "Content-Security-Policy", value: CSP }
      ] }
    ];
  }
};
export default nextConfig;

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Build a CSP that is strict in production but allows eval in development
function buildCSP() {
  const isDev = process.env.NODE_ENV !== "production";
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    "https://cdn.openai.com",
    "https://chat.openai.com",
  ];
  if (isDev) scriptSrc.push("'unsafe-eval'"); // needed for React Refresh / dev tooling

  const connectSrc = [
    "'self'",
    "https://*.supabase.co",
    "https://*.supabase.in",
    "wss://*.supabase.co",
    "wss://*.supabase.in",
    "https://api.openai.com",
    "https://cdn.openai.com",
    "https://chat.openai.com",
    "wss://api.openai.com",
    "wss://chat.openai.com",
  ];
  if (isDev)
    connectSrc.push("ws:", "http://localhost:3000", "http://localhost:8888");

  const frameSrc = [
    "'self'",
    "https://app.netlify.com",
    "https://chat.openai.com",
  ];

  const workerSrc = [
    "'self'",
    "blob:",
    "https://chat.openai.com",
    "https://cdn.openai.com",
  ];

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    `connect-src ${connectSrc.join(" ")}`,
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    `frame-src ${frameSrc.join(" ")}`,
    "frame-ancestors 'self'",
    `worker-src ${workerSrc.join(" ")}`,
  ].join("; ");
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Skip static and asset routes
  if (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  res.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0",
  );
  res.headers.set("Content-Security-Policy", buildCSP());
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()",
  );
  return res;
}

export const config = {
  matcher: [
    // Match everything except static files and API static assets
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};

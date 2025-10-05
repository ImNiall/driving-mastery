// scripts/check-no-frontendapi.cjs
const isProd = process.env.CONTEXT === 'production' || process.env.NODE_ENV === 'production';
const hasOverride = !!process.env.VITE_CLERK_FRONTEND_API;
if (isProd && hasOverride) {
  console.error('[Build blocked] Remove VITE_CLERK_FRONTEND_API. Production must use publishableKey only.');
  process.exit(1);
} else {
  console.log('[Build check] Clerk frontendApi override:', hasOverride ? 'present' : 'absent', '| context:', process.env.CONTEXT || process.env.NODE_ENV);
}

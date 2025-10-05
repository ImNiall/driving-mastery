# Post-Migration Operator Checklist

1) Netlify environment (set/keep)
- VITE_SUPABASE_URL (from Supabase → Project Settings → API)
- VITE_SUPABASE_ANON_KEY (same page)
- (Server/Functions only, if used) SUPABASE_SERVICE_ROLE_KEY

2) Netlify environment (remove)
- VITE_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- VITE_CLERK_FRONTEND_API

3) Security & headers
- Confirm netlify.toml CSP connect-src allows: https://*.supabase.co https://*.supabase.net
- Confirm no Clerk domains remain in CSP.
- (Optional) keep HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy as currently configured.

4) Deploy clean
- Netlify → Deploys → Clear cache and deploy site.
- Browser → Hard refresh (Cmd/Ctrl+Shift+R).

5) Live verification (must pass)
- Visit /sign-in → enter email → receive magic link → click → app shows you as signed in.
- Protected page:
  - Signed out → redirects to /sign-in.
  - Signed in → renders normally.
- Header shows “Hello, your@email”.
- Netlify Functions you protected return 401 when signed out and 200 when signed in.
- DevTools Console: no Clerk errors, no CSP violations.

6) Email settings (magic link delivery)
- Supabase → Authentication → Email: verify sender domain/SMTP (use Supabase default or your custom).
- Send yourself a magic link to confirm deliverability (check spam).

7) Documentation & hygiene
- README: note Supabase Auth is the auth provider; update local dev instructions (VITE_SUPABASE_*).
- Verify .gitignore contains .env* patterns (no env files in git).
- If we added Secretlint + Husky, run npm i locally once to activate hooks.

8) Optional monitoring
- Add your monitoring (Sentry/Logtail) breadcrumb on auth state changes.
- Consider adding a simple uptime check for /sign-in.

9) Rollback plan (if needed)
- If deploy fails, revert to previous Netlify deploy from Deploys → Rollbacks.
- No code rollback needed unless you explicitly want to.

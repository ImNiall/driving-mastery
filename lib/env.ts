import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .default("https://www.drivingmastery.co.uk"),
  NEXT_PUBLIC_CHATKIT_DOMAIN_PUBLIC_KEY: z.string().min(10).optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
});

const trimmedDomainKey = (
  process.env.NEXT_PUBLIC_CHATKIT_DOMAIN_PUBLIC_KEY || ""
).trim();

export const env = EnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_CHATKIT_DOMAIN_PUBLIC_KEY:
    trimmedDomainKey.length > 0 ? trimmedDomainKey : undefined,
  NODE_ENV: process.env.NODE_ENV,
});

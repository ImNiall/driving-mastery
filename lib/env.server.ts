import { z } from "zod";
import { env } from "@/lib/env";

const ServerEnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(20),
  WORKFLOW_ID: z.string().min(5).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional(),
  SUPABASE_URL: z.string().url().optional(),
  APP_BASE_URL: z.string().url().optional(),
});

const parsed = ServerEnvSchema.parse({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  WORKFLOW_ID: process.env.WORKFLOW_ID,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  APP_BASE_URL: process.env.APP_BASE_URL,
});

export const serverEnv = {
  OPENAI_API_KEY: parsed.OPENAI_API_KEY,
  WORKFLOW_ID: parsed.WORKFLOW_ID ?? "",
  SUPABASE_SERVICE_ROLE_KEY: parsed.SUPABASE_SERVICE_ROLE_KEY ?? "",
  SUPABASE_URL: parsed.SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL,
  APP_BASE_URL:
    parsed.APP_BASE_URL ?? env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  // System
  NODE_ENV: z.enum(["development", "test", "production"]),
  WS_PORT: z.coerce.number(),
  PORT: z.coerce.number(),

  // Authentication
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  NEXTAUTH_URL: z.preprocess(
    // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    // Since NextAuth automatically uses the VERCEL_URL if present.
    (str) => process.env.VERCEL_URL ?? str,
    // VERCEL_URL doesnt include `https` so it cant be validated as a URL
    process.env.VERCEL ? z.string() : z.string().url()
  ),

  // Email Processing
  EMAIL_FROM: z.string(),
  RESEND_API_KEY: z.string(),
  RESEND_DOMAIN: z.string(),

  // Database
  DATABASE_URL: z.string().url(),

  // Storage
  STORAGE_TYPE: z.string(),
  STORAGE_PROJECT_ID: z.string(),
  STORAGE_PRIVATE_KEY_ID: z.string(),
  STORAGE_PRIVATE_KEY: z.string(),
  STORAGE_CLIENT_EMAIL: z.string(),
  STORAGE_CLIENT_ID: z.string(),
  STORAGE_AUTH_URI: z.string(),
  STORAGE_TOKEN_URI: z.string(),
  STORAGE_AUTH_PROVIDER_CERT_URL: z.string(),
  STORAGE_CLIENT_CERT_URL: z.string(),
  STORAGE_BUCKET: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string(),
  NEXT_PUBLIC_WS_URL: z.string(),
  NODE_ENV: z.enum(["development", "test", "production"]),
});

export const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);

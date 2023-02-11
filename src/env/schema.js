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
    process.env.VERCEL ? z.string() : z.string().url(),
  ),
  EMAIL_SERVER: z.string(),
  EMAIL_FROM: z.string(),
  GOOGLE_ID: z.string(),
  GOOGLE_SECRET: z.string(),

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
  STORAGE_BUCKET: z.string()
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  // NEXT_PUBLIC_BAR: z.string(),
  NEXT_PUBLIC_WS_URL: z.string(),
  NEXT_PUBLIC_APP_URL: z.string()
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
  // NEXT_PUBLIC_BAR: process.env.NEXT_PUBLIC_BAR,
  NEXT_PUBLIC_WS_URL: process.env.WS_URL,
  NEXT_PUBLIC_APP_URL: process.env.APP_URL
};

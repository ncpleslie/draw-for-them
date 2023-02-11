// @ts-check
/**
 * This file is included in `/next.config.mjs` which ensures the app isn't built with invalid env vars.
 * It has to be a `.mjs`-file to be imported there.
 */
import { serverSchema } from "./schema.js";
import { env as clientEnv, formatErrors } from "./client.js";
import * as dotenv from 'dotenv'

let _serverEnv = serverSchema.safeParse(process.env);

if (!_serverEnv.success) {
  console.warn('Failed to load server environment variables. Attempting to load alternatives.')
  const result = dotenv.config();
  if (result.error) {
    throw new Error('Backup environment variables failed');
  }

  _serverEnv = serverSchema.safeParse(result.parsed);

  if (!_serverEnv.success) {
    console.error(
      "❌ Invalid environment variables:\n",
      ...formatErrors(_serverEnv.error.format()),
    );
    throw new Error("Invalid environment variables");
  }
}

for (let key of Object.keys(_serverEnv.data)) {
  if (key.startsWith("NEXT_PUBLIC_")) {
    console.warn("❌ You are exposing a server-side env-variable:", key);

    throw new Error("You are exposing a server-side env-variable");
  }
}

export const env = { ..._serverEnv.data, ...clientEnv };

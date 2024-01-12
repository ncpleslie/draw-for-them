// @ts-check
/**
 * This file is included in `/next.config.mjs` which ensures the app isn't built with invalid env vars.
 * It has to be a `.mjs`-file to be imported there.
 */
import { formatErrors, serverSchema } from "./schema.js";
import { env as clientEnv } from "./client.js";
import * as dotenv from "dotenv";

const loadEnvVariables = () => {
  // Sometimes process environment variables are available, depending on environment.
  // We can attempt to process values with the dotenv package instead.
  let serverEnv = serverSchema.safeParse(process.env);
  if (!serverEnv.success) {
    console.warn(
      "Failed to load server environment variables. Attempting to load alternatives.",
      ...formatErrors(serverEnv.error.format())
    );

    const dotenvResult = dotenv.config();

    if (dotenvResult.error) {
      throw new Error(
        "Backup environment variables failed",
        dotenvResult.error
      );
    }

    serverEnv = serverSchema.safeParse(dotenvResult.parsed);

    if (!serverEnv.success) {
      console.error(
        "Invalid environment variables:\n",
        ...formatErrors(serverEnv.error.format())
      );
      throw new Error("Invalid environment variables");
    }
  }

  for (let key of Object.keys(serverEnv.data)) {
    if (key.startsWith("NEXT_PUBLIC_")) {
      console.warn("You are exposing a server-side env-variable:", key);
      throw new Error("You are exposing a server-side env-variable");
    }
  }

  return { ...serverEnv.data, ...clientEnv };
};

export const env = loadEnvVariables();

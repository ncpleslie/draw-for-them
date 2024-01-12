// @ts-check
import getConfig from "next/config.js";
import { clientSchema, formatErrors } from "./schema.js";

const loadEnvVariables = () => {
  const config = getConfig();
  const clientValues =
    config && config.publicRuntimeConfig
      ? config.publicRuntimeConfig
      : process.env;

  const clientEnv = clientSchema.safeParse(clientValues);
  if (!clientEnv.success) {
    console.error(
      "Failed to load client environment variables.",
      ...formatErrors(clientEnv.error.format())
    );
    throw new Error("Invalid environment variables");
  }

  for (let key of Object.keys(clientEnv.data)) {
    if (!key.startsWith("NEXT_PUBLIC_") && key !== "NODE_ENV") {
      console.warn(
        `❌ Invalid public environment variable name: ${key}. It must begin with 'NEXT_PUBLIC_'`
      );

      throw new Error("Invalid public environment variable name");
    }
  }

  return { ...clientEnv.data };
};

export const env = loadEnvVariables();

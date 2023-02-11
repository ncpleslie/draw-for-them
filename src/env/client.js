// @ts-check
import { clientEnv, clientSchema } from "./schema.js";
import * as dotenv from 'dotenv'

let _clientEnv = clientSchema.safeParse(clientEnv);

export const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors,
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);

if (!_clientEnv.success) {
  console.warn('Failed to load client environment variables. Attempting to load alternatives.')

  const result = dotenv.config()
  if (result.error) {
    throw new Error('Backup environment variables failed');
  }

  _clientEnv = clientSchema.safeParse(result.parsed);

  if (!_clientEnv.success) {
    console.error(
      "❌ Invalid environment variables:\n",
      ...formatErrors(_clientEnv.error.format()),
    );
    throw new Error("Invalid environment variables");
  }
}

for (let key of Object.keys(_clientEnv.data)) {
  if (!key.startsWith("NEXT_PUBLIC_")) {
    console.warn(
      `❌ Invalid public environment variable name: ${key}. It must begin with 'NEXT_PUBLIC_'`,
    );

    throw new Error("Invalid public environment variable name");
  }
}

export const env = _clientEnv.data;

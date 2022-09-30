// src/server/db/client.ts
import { PrismaClient } from "@prisma/client";
const env = (async () => {
  const { env } = await import("../../env/server.mjs");

  return env;
})().catch((err) => console.error(err));

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

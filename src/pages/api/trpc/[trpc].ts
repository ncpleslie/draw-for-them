import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "../../../env/server.mjs";
import { createContext } from "../../../server/trpc/context";
import { appRouter } from "../../../server/trpc/router/_app";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error, path }) {
    if (env.NODE_ENV === "development") {
      console.error(`❌ tRPC failed on ${path}: ${error}`);
    }
  },
});

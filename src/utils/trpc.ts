import {
  httpBatchLink,
  loggerLink,
  createWSClient,
  wsLink,
} from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { NextPageContext } from "next";
import superjson from "superjson";
import { type AppRouter } from "../server/trpc/router/_app";
import { env } from "../env/client";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return ""; // browser should use relative url
  }
  if (env.NEXT_PUBLIC_APP_URL) {
    return `https://${env.NEXT_PUBLIC_APP_URL}`; // SSR should use vercel url
  }

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

const getBaseWsUrl = () => {
  if (env.NEXT_PUBLIC_WS_URL) {
    return `wss://${env.NEXT_PUBLIC_WS_URL}`;
  }

  return `ws://localhost:${process.env.WS_PORT ?? 3001}`;
};

function getEndingLink(ctx: NextPageContext | undefined) {
  if (typeof window === "undefined") {
    return httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      headers() {
        if (ctx?.req) {
          // on ssr, forward client's headers to the server
          return {
            ...ctx.req.headers,
            "x-ssr": "1",
          };
        }
        return {};
      },
    });
  }

  const client = createWSClient({
    url: getBaseWsUrl(),
  });

  return wsLink<AppRouter>({
    client,
  });
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      transformer: superjson,
      queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
      links: [
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === "development" &&
              typeof window !== "undefined") ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        getEndingLink(ctx),
      ],
    };
  },
  ssr: true,
});

/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;

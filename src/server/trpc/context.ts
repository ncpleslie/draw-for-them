import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";
import { type IncomingMessage } from "http";
import { type Session } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../common/get-server-auth-session";
import type ws from "ws";
import { imageEventService, userService } from "../provider/global-provider";

type CreateContextOptions = {
  session: Session | null;
};

/** Use this helper for:
 * - testing, so we don't have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    imageEventService: imageEventService,
    userService: userService,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (
  opts:
    | CreateNextContextOptions
    | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
) => {
  const { req, res }: { req: NextApiRequest; res: NextApiResponse } =
    opts as CreateNextContextOptions;
  const session = await getServerAuthSession({ req, res });

  return await createContextInner({
    session,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;

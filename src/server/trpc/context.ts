import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import { imageEventService, userService } from "../provider/global-provider";
import { type CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { getSession } from "next-auth/react";

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
  opts: CreateNextContextOptions | CreateWSSContextFnOptions
) => {
  const session = await getSession(opts);

  return await createContextInner({
    session,
  });
};

export type Context = Awaited<ReturnType<typeof createContext>>;

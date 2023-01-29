import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";
import { IncomingMessage } from "http";
import { type Session } from "next-auth";
import { getSession } from "next-auth/react";
import ws from "ws";
import { prisma } from "../db/client";
import ImageDomain from "../domain/image-domain";
import UserDomain from "../domain/user-domain";
import MockStorageClient from "../storage/mock-storage-client";
import StorageClient from "../storage/storage-client";

type CreateContextOptions = {
  session: Session | null;
};

// TODO: FIND A PLACE FOR THESE TO BE SINGLETONS!
const storageClient =
  process.env.NODE_ENV === "production"
    ? new StorageClient()
    : new MockStorageClient();

const userDomain = new UserDomain(prisma.user);
const imageDomain = new ImageDomain(prisma.imageEvent, storageClient);

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    userDomain,
    imageDomain,
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
  const session = await getSession(opts);

  return await createContextInner({
    session,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;

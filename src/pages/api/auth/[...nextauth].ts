import Cookies from "cookies";
import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { decode, encode } from "next-auth/jwt";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import AppConstants from "../../../constants/app.constants";
import {
  emailClient,
  userService,
} from "../../../server/provider/global-provider";
import { env } from "../../../env/server";
import { prisma } from "../../../server/domain/db/client";
import { Routes } from "../../../enums/routes.enum";

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = requestWrapper(req, res);
  return await NextAuth(...data);
};

export default handler;

export function requestWrapper(
  req: NextApiRequest,
  res: NextApiResponse
): [req: NextApiRequest, res: NextApiResponse, opts: NextAuthOptions] {
  const generateSessionToken = () => uuid();

  const fromDate = (time: number, date = Date.now()) =>
    new Date(date + time * 1000);

  const adapter = PrismaAdapter(prisma);

  const opts: NextAuthOptions = {
    adapter: adapter,
    callbacks: {
      session({ session, user }) {
        if (session.user) {
          session.user.id = user.id;
        }

        return session;
      },
      async signIn({ user }) {
        // Check if this sign in callback is being called in the credentials authentication flow. If so, use the next-auth adapter to create a session entry in the database (SignIn is called after authorize so we can safely assume the user is valid and already authenticated).
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth?.includes("credentials") &&
          req.method === "POST"
        ) {
          if (user) {
            const sessionToken = generateSessionToken();
            const sessionExpiry = fromDate(AppConstants.maxSessionAgeInSecs);

            await adapter.createSession?.({
              sessionToken: sessionToken,
              userId: user.id,
              expires: sessionExpiry,
            });

            const cookies = new Cookies(req, res);

            cookies.set("next-auth.session-token", sessionToken, {
              expires: sessionExpiry,
              sameSite: true,
            });
          }
        }

        return true;
      },
    },
    jwt: {
      encode: async ({ token, secret, maxAge }) => {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          const cookies = new Cookies(req, res);
          const cookie = cookies.get("next-auth.session-token");
          if (cookie) return cookie;
          else return "";
        }
        // Revert to default behavior when not in the credentials provider callback flow
        return encode({ token, secret, maxAge });
      },
      decode: async ({ token, secret }) => {
        if (
          req.query.nextauth?.includes("callback") &&
          req.query.nextauth.includes("credentials") &&
          req.method === "POST"
        ) {
          return null;
        }

        // Revert to default behavior when not in the credentials provider callback flow
        return decode({ token, secret });
      },
    },
    pages: {
      signIn: Routes.SignIn,
      newUser: Routes.NewUser,
      signOut: Routes.SignOut,
    },
    secret: env.NEXTAUTH_SECRET,
    debug: env.NODE_ENV !== "production",
    providers: [
      // Credentials provider based on the following repo:
      // https://github.com/abehidek/sandbox/tree/main/t3-stack/auth-credentials-db-session
      CredentialsProvider({
        name: "anonymous",
        credentials: {},
        async authorize() {
          return await userService.createAnonymousUserAsync();
        },
      }),
      // This magic link auth process is based off https://www.ramielcreations.com/nexth-auth-magic-code
      // and https://github.com/nextauthjs/next-auth/issues/4965#issuecomment-1189094806
      EmailProvider({
        from: env.EMAIL_FROM,
        maxAge: 5 * 60,
        async generateVerificationToken() {
          return uuid().substring(0, 6).toUpperCase();
        },
        async sendVerificationRequest({ identifier: email, url, token }) {
          const { host } = new URL(url);
          await emailClient.sendVerificationAsync(email, token, url, host);
        },
      }),
    ],
  };

  return [req, res, opts];
}

import type {
  ImageEvent as PrismaImageEvent,
  User as PrismaUser,
} from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { env } from "../../../env/server.js";

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

export type ImageEvent = PrismaImageEvent;
export type ImageEventWithSender = ImageEvent & { sender: User };
type UserDomainType = typeof prisma.user;
type ImageEventType = typeof prisma.imageEvent;

export type User = PrismaUser;
export type Friend = Omit<User, "email" | "emailVerified">;
export type IUserDomain = UserDomainType;
export const UserDB = prisma.user as IUserDomain;
export type IImageEventDomain = ImageEventType;
export const ImageEventDB = prisma.imageEvent as IImageEventDomain;

import { PrismaClient, ImageEvent, User } from "@prisma/client";
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

export type ImageEventWithSender = ImageEvent & { sender: User };
type UserDomainType = typeof prisma.user;
type ImageEventType = typeof prisma.imageEvent;

export interface IUserDomain extends UserDomainType {}
export interface IImageEventDomain extends ImageEventType {}

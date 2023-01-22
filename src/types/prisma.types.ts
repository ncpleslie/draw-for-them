import { ImageEvent, User } from "@prisma/client";
import { prisma } from "../server/db/client";

export type ImageEventWithSender = ImageEvent & { sender: User };
export type UserDomainType = typeof prisma.user;
export type ImageDomainType = typeof prisma.imageEvent;

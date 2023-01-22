import { ImageEvent, User } from "@prisma/client";

export type ImageEventWithSender = ImageEvent & { sender: User };

import { z } from "zod";
import { createProtectedRouter } from "./context";

export const userRouter = createProtectedRouter()
  .query("getUserByName", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        return await ctx.prisma.user.findFirst({
          where: { email: input.name },
        });
      } catch (error) {
        console.log(error);
      }
    },
  })
  .mutation("addUserAsFriendById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const currentUserId = ctx.session.user.id;
        await ctx.prisma.user.update({
          where: { id: currentUserId },
          data: { friends: { connect: [{ id: input.id }] } },
        });
      } catch (error) {
        console.log(error);
      }
    },
  })
  .mutation("sendUserImage", {
    input: z.object({
      imageData: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        const currentUserId = ctx.session.user.id;
        const currentUser = await ctx.prisma.user.findFirst({
          where: { id: currentUserId },
          include: { friends: true },
        });

        if (currentUser?.friends?.length === 0) {
          throw new Error("User has no friends");
        }

        const firstFriendId = currentUser!.friends[0]!.id;
        await ctx.prisma.user.update({
          where: { id: firstFriendId },
          data: {
            receivedImages: {
              create: { imageData: input.imageData, senderId: currentUserId },
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  })
  .query("getAllImagesForUser", {
    async resolve({ ctx }) {
      try {
        const userWithImageEvents = await ctx.prisma.user.findFirst({
          where: { id: ctx.session.user.id },
          include: { receivedImages: true },
        });

        return userWithImageEvents?.receivedImages;
      } catch (error) {
        console.log(error);
      }
    },
  })
  .query("getImageById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      try {
        return await ctx.prisma.imageEvent.findFirst({
          where: { id: input.id },
        });
      } catch (error) {
        console.log(error);
      } finally {
        await ctx.prisma.imageEvent.delete({ where: { id: input.id } });
      }
    },
  });

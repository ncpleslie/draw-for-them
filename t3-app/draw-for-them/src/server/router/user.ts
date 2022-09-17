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
          data: { friendId: input.id },
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
        });
        if (!currentUser?.friendId) {
          throw new Error("User has no friends");
        }

        await ctx.prisma.user.update({
          where: { id: currentUser.friendId },
          data: {
            images: { create: { imageData: input.imageData } },
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
        return await ctx.prisma.image.findMany({
          where: { receiverId: ctx.session.user.id },
        });
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
        return await ctx.prisma.image.findFirst({
          where: { id: input.id },
        });
      } catch (error) {
        console.log(error);
      } finally {
        await ctx.prisma.image.delete({ where: { id: input.id } });
      }
    },
  });

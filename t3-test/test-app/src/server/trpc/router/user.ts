import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  getUserByName: protectedProcedure
    .input(
      z.object({
        name: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findFirst({
        where: { email: input.name },
      });
    }),
  addUserAsFriendById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;
      await ctx.prisma.user.update({
        where: { id: currentUserId },
        data: { friends: { connect: [{ id: input.id }] } },
      });
    }),
  sendUserImage: protectedProcedure
    .input(
      z.object({
        imageData: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;
      const currentUser = await ctx.prisma.user.findFirst({
        where: { id: currentUserId },
        include: { friends: true },
      });

      if (!currentUser || currentUser.friends.length === 0) {
        throw new Error("User has no friends");
      }

      const firstFriendId = currentUser.friends[0]?.id;
      console.log(currentUser);
      await ctx.prisma.user.update({
        where: { id: firstFriendId },
        data: {
          receivedImages: {
            create: { imageData: input.imageData, senderId: currentUserId },
          },
        },
      });
    }),
  getAllImagesForUser: protectedProcedure.query(async ({ ctx }) => {
    const userWithImageEvents = await ctx.prisma.user.findFirst({
      where: { id: ctx.session.user.id },
      include: { receivedImages: { where: { active: true } } },
    });

    return userWithImageEvents?.receivedImages;
  }),
  getImageById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.imageEvent.findFirst({
          where: { id: input.id, active: true },
        });
      } catch (error) {
        console.log(error);
      } finally {
        ctx.prisma.imageEvent.update({
          where: { id: input.id },
          data: { active: false },
        });
      }
    }),
});

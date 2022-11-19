import { z } from "zod";
import { protectedProcedure, router } from "./context";

export const userRouter = router({
  getUserByName: protectedProcedure
    .input(
      z.object({
        name: z.string().trim(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: { email: input.name },
      });
    }),
  addUserAsFriendById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;
      ctx.prisma.user.update({
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

      if (!currentUser || !currentUser.friends) {
        throw new Error("User has no friends");
      }

      const firstFriendId = currentUser.friends.at(0)?.id;
      await ctx.prisma.user.update({
        where: { id: firstFriendId },
        data: {
          receivedImages: {
            create: { imageData: input.imageData, senderId: currentUserId },
          },
        },
      });
    }),
  getAllImagesForUser: protectedProcedure.query(({ ctx }) => {
    const userWithImageEvents = ctx.prisma.user.findFirst({
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
    .query(({ ctx, input }) => {
      try {
        return ctx.prisma.imageEvent.findFirst({
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

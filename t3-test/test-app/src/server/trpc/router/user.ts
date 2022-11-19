import { z } from "zod";
import { EventEmitter } from "events";
import { protectedProcedure, router } from "../trpc";
import { EventEmitterEvent } from "../../../enums/event-emitter-event.enum";
import { observable } from "@trpc/server/observable";
import { ImageEvent } from ".prisma/client";

// (could be replaced by redis, etc)
const ee = new EventEmitter();

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
      await ctx.prisma.user.update({
        where: { id: firstFriendId },
        data: {
          receivedImages: {
            create: { imageData: input.imageData, senderId: currentUserId },
          },
        },
      });

      ee.emit(EventEmitterEvent.NewImage);
    }),
  getAllImagesForUser: protectedProcedure.subscription(async ({ ctx }) => {
    return observable<ImageEvent[] | undefined>((emit) => {
      const onNewImage = async () => {
        const userWithImageEvents = await ctx.prisma.user.findFirst({
          where: { id: ctx.session.user.id },
          include: { receivedImages: { where: { active: true } } },
        });
        emit.next(userWithImageEvents?.receivedImages);
      };

      ee.on(EventEmitterEvent.NewImage, onNewImage);

      return () => {
        ee.off(EventEmitterEvent.NewImage, onNewImage);
      };
    });
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
        await ctx.prisma.imageEvent.update({
          where: { id: input.id },
          data: { active: false },
        });
      }
    }),
});

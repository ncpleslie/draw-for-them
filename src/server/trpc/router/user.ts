import { z } from "zod";
import { EventEmitter } from "events";
import { protectedProcedure, router } from "../trpc";
import { EventEmitterEvent } from "../../../enums/event-emitter-event.enum";
import { observable } from "@trpc/server/observable";
import { Context } from "../context";
import { NotificationDrawEvent } from "../../../models/draw_event.model";

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
  getAllImagesForUser: protectedProcedure.query(async ({ ctx }) => {
    return await getAllUserImages(ctx);
  }),
  subToAllImagesForUser: protectedProcedure.subscription(async ({ ctx }) => {
    return observable<NotificationDrawEvent[] | undefined>((emit) => {
      const onNewImage = async () => {
        try {
          const receivedImages = await getAllUserImages(ctx);

          emit.next(receivedImages);
        } catch (error) {
          console.log("error occurred fetching events", error);

          return error;
        }
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

export const getAllUserImages = async (
  ctx: Context
): Promise<NotificationDrawEvent[] | undefined> => {
  const userWithImageEvents = await ctx.prisma.user.findFirst({
    where: { id: ctx.session?.user?.id },
    include: {
      receivedImages: { include: { sender: true }, where: { active: true } },
    },
  });

  return userWithImageEvents?.receivedImages.map(
    (image) => new NotificationDrawEvent(image)
  );
};

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
      return await ctx.userDomain.getUserByNameAsync(input.name);
    }),
  addUserAsFriendById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;
      await ctx.userDomain.addUserAsFriendByIdAsync(currentUserId, input.id);
    }),
  sendUserImage: protectedProcedure
    .input(
      z.object({
        imageData: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;
      await ctx.userDomain.addImageEventToUserByIdAsync(
        currentUserId,
        input.imageData
      );

      ee.emit(EventEmitterEvent.NewImage);
    }),
  getAllImagesForUser: protectedProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session.user.id;
    const imageEvents = await ctx.userDomain.getAllImagesForUserAsync(
      currentUserId
    );

    return imageEvents?.map((image) => new NotificationDrawEvent(image));
  }),
  subToAllImagesForUser: protectedProcedure.subscription(async ({ ctx }) => {
    const onNewImage = async () => {
      console.log("onNewImages");
      const currentUserId = ctx.session.user.id;
      const imageEvents = await ctx.userDomain.getAllImagesForUserAsync(
        currentUserId
      );

      return imageEvents?.map((image) => new NotificationDrawEvent(image));
    };

    return subscribeToEvent<NotificationDrawEvent[] | undefined>(
      EventEmitterEvent.NewImage,
      onNewImage
    );
  }),
  getImageById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const image = await ctx.imageDomain.getActiveImageByIdAsync(input.id);
      await ctx.imageDomain.setImageInactiveByIdAsync(input.id);

      ee.emit(EventEmitterEvent.NewImage);

      return image;
    }),
});

const subscribeToEvent = <TReturn>(
  eventName: EventEmitterEvent,
  event: () => Promise<TReturn>
) => {
  return observable<TReturn>((emit) => {
    const wrappedEvent = async () => {
      const result = await event();
      emit.next(result);
    };

    ee.on(eventName, wrappedEvent);

    return () => {
      ee.off(eventName, wrappedEvent);
    };
  });
};

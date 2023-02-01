import { z } from "zod";
import { EventEmitter } from "events";
import { protectedProcedure, router } from "../trpc";
import { EventEmitterEvent } from "../../../enums/event-emitter-event.enum";
import { observable } from "@trpc/server/observable";
import { NotificationDrawEvent } from "../../../models/draw_event.model";

const ee = new EventEmitter();

export const userRouter = router({
  addUserAsFriendById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;
      await ctx.userService.addUserAsFriendByIdAsync(currentUserId, input.id);
    }),

  getAllImageEventsForUser: protectedProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session.user.id;
    const imageEvents = await ctx.userService.getAllImageEventsForUserAsync(
      currentUserId
    );

    return imageEvents?.map((image) => new NotificationDrawEvent(image));
  }),

  getImageById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const image = await ctx.imageEventService.getActiveImageByIdAsync(
        input.id
      );
      await ctx.imageEventService.setImageInactiveByIdAsync(input.id);

      ee.emit(EventEmitterEvent.NewImage);

      return image;
    }),

  getUserByName: protectedProcedure
    .input(
      z.object({
        name: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.userService.getUserByNameAsync(input.name);
    }),

  sendUserImage: protectedProcedure
    .input(
      z.object({
        imageData: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;
      const receiverId = await ctx.userService.getUsersFirstFriendAsync(
        currentUserId
      );

      await ctx.imageEventService.addImageByIdAsync(
        currentUserId,
        receiverId,
        input.imageData
      );

      ee.emit(EventEmitterEvent.NewImage);
    }),

  subscribeToImageEventsForUser: protectedProcedure.subscription(
    async ({ ctx }) => {
      const onNewImage = async () => {
        const currentUserId = ctx.session.user.id;
        const imageEvents = await ctx.userService.getAllImageEventsForUserAsync(
          currentUserId
        );

        return imageEvents?.map((image) => new NotificationDrawEvent(image));
      };

      return subscribeToEvent<NotificationDrawEvent[] | undefined>(
        EventEmitterEvent.NewImage,
        onNewImage
      );
    }
  ),
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

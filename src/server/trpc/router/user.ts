import { z } from "zod";
import { EventEmitter } from "events";
import { protectedProcedure, router } from "../trpc";
import { EventEmitterEvent } from "../../../enums/event-emitter-event.enum";
import { NotificationDrawEvent } from "../../../models/draw_event.model";
import { awaitableDelay } from "../../../utils/helper.utils";
import { subscribeToEvent } from "../../../utils/event-subscription.utils";

const ee = new EventEmitter();

/**
 * The user router for interacting with users.
 */
export const userRouter = router({
  /**
   * Adds a user as a friend by id to the current user.
   * @throws - ValidationError
   * @throws - NotFoundError
   */
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

  /**
   * Deletes a friend by id from the current user.
   * @returns - The current user without the friend.
   * @throws - ValidationError
   * @throws - NotFoundError
   */
  deleteFriendById: protectedProcedure
    .input(
      z.object({
        id: z.string().trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;
      return await ctx.userService.deleteFriendByIdAsync(
        currentUserId,
        input.id
      );
    }),

  /**
   * Gets all image events for the current user.
   * @returns - The current user's image events.
   * @throws - NotFoundError
   * @throws - ValidationError
   */
  getAllImageEventsForUser: protectedProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session.user.id;
    const imageEvents = await ctx.userService.getAllImageEventsForUserAsync(
      currentUserId
    );

    return imageEvents?.map((image) => new NotificationDrawEvent(image));
  }),

  /**
   * Gets an image by id for the current user.
   * @returns - The current user's image.
   * @throws - NotFoundError
   * @throws - ValidationError
   */
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

  /**
   * Gets all of the current user's friends
   * @returns - The current user's friends.
   */
  getFriends: protectedProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.session.user.id;

    return await ctx.userService.getUserFriendsAsync(currentUserId);
  }),

  /**
   * Gets a user by id.
   * @returns - The user.
   * @throws - NotFoundError
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.userService.getUserProfileAsync(ctx.session.user.id);
  }),

  /**
   * Get a user's history by id.
   * @returns - The user's history.
   */
  getHistoryByUserId: protectedProcedure
    .input(
      z.object({
        friendId: z.string().trim(),
      })
    )
    .query(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;

      return await ctx.userService.getHistoryByUserIdAsync(
        currentUserId,
        input.friendId
      );
    }),

  /**
   * Gets a user by name.
   * @returns - The user.
   */
  getUsersByName: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().min(3),
      })
    )
    .query(async ({ ctx, input }) => {
      await awaitableDelay(500);

      return await ctx.userService.getUsersByNameAsync(
        input.name.toLowerCase()
      );
    }),

  /**
   * Sends an image to a user by id.
   * This will create an image event for the receiver.
   */
  sendUserImage: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        imageData: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;
      const receiverId = await ctx.userService.getUsersFriendByIdAsync(
        currentUserId,
        input.userId
      );

      await ctx.imageEventService.addImageByIdAsync(
        currentUserId,
        receiverId.id,
        input.imageData
      );

      ee.emit(EventEmitterEvent.NewImage);
    }),

  /**
   * Subscribes to image events for the current user.
   * This will emit whenever a new image event is created for the current user.
   * @returns - The current user's image events.
   */
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
        ee,
        EventEmitterEvent.NewImage,
        onNewImage
      );
    }
  ),

  /**
   * Updates the current user's profile.
   * @returns - The updated user.
   * @throws - ValidationError
   */
  updateUserProfile: protectedProcedure
    .input(
      z
        .object({
          name: z.string().trim().min(3),
        })
        .partial()
        .refine(
          (data: Record<string | number | symbol, unknown>) =>
            Object.values(data).some((v) => !!v),
          {
            message:
              "At least one value must be provided if you want to update a profile",
          }
        )
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.userService.updateProfileAsync(
        ctx.session.user.id,
        input
      );
    }),
});

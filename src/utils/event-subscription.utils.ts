import { type EventEmitter } from "events";
import { observable } from "@trpc/server/observable";
import { type EventEmitterEvent } from "../enums/event-emitter-event.enum";

/**
 * Subscribes to an event.
 * @param ee - The event emitter.
 * @param eventName - The name of the event.
 * @param event - The event to subscribe to.
 * @returns The observable.
 */
export const subscribeToEvent = <TReturn>(
  ee: EventEmitter,
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

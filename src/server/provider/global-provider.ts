import { prisma } from "../domain/db/client";
import StorageClient from "../domain/storage/storage-client";
import ImageEventService from "../services/image-event.service";
import UserService from "../services/user.service";

class GlobalRef<T> {
  private readonly sym: symbol;

  constructor(uniqueName: string) {
    this.sym = Symbol.for(uniqueName);
  }

  get value() {
    return (global as any)[this.sym] as T;
  }

  set value(value: T) {
    (global as any)[this.sym] = value;
  }
}

const userServiceRef = new GlobalRef<UserService>(UserService.name);
if (!userServiceRef.value) {
  userServiceRef.value = new UserService(prisma.user);
}

const imageEventServiceRef = new GlobalRef<ImageEventService>(
  ImageEventService.name
);
if (!imageEventServiceRef.value) {
  imageEventServiceRef.value = new ImageEventService(
    prisma.imageEvent,
    new StorageClient()
  );
}

export const userService = userServiceRef.value;
export const imageEventService = imageEventServiceRef.value;

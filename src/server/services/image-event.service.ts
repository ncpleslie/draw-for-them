import { type IImageEventDomain } from "../domain/db/client";
import type IStorageClient from "../domain/storage/storage-client.interface";
import NotFoundError from "./errors/not-found.error";

/**
 * The image event service for interacting with image events in the database.
 */
export default class ImageEventService {
  /**
   * Creates an instance of image event service.
   * @param db - The database.
   * @param storage - The storage client.
   */
  constructor(
    private db: IImageEventDomain,
    private storage: IStorageClient<string>
  ) {}

  /**
   * Adds an image event by id.
   * @param senderId - The id of the person who sent the image.
   * @param receiverId - The id of the person who received the image.
   * @param imageString - The image as a base64 string.
   */
  public async addImageByIdAsync(
    senderId: string,
    receiverId: string,
    imageString: string
  ) {
    const imageEvent = await this.db.create({
      data: {
        active: true,
        date: new Date(),
        sender: {
          connect: {
            id: senderId,
          },
        },
        receiver: {
          connect: {
            id: receiverId,
          },
        },
      },
    });

    await this.storage.storeById(imageEvent.id, imageString);
  }

  /**
   * Gets the active image by id.
   * @param imageId - The id of the image to retrieve.
   * @returns - The image as a base64 string.
   */
  public async getActiveImageByIdAsync(imageId: string) {
    const activeImage = await this.db.findFirst({
      where: { id: imageId, active: true },
    });

    if (!activeImage) {
      throw new NotFoundError("Image event not found.");
    }

    return await this.storage.getById(activeImage.id);
  }

  /**
   * Sets an image inactive by id.
   * Used when a user has viewed an image.
   * @param imageId - The id of the image to set inactive.
   */
  public async setImageInactiveByIdAsync(imageId: string) {
    await this.db.update({
      where: { id: imageId },
      data: { active: false },
    });
  }
}

import { IImageEventDomain } from "../domain/db/client";
import IStorageClient from "../domain/storage/storage-client.interface";
import DomainNotFoundError from "./errors/domain-not-found.error";

export default class ImageEventService {
  constructor(private db: IImageEventDomain, private storage: IStorageClient) {}

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

    await this.storage.storeBase64ImageAsync(imageEvent.id, imageString);
  }

  public async getActiveImageByIdAsync(imageId: string) {
    const activeImage = await this.db.findFirst({
      where: { id: imageId, active: true },
    });

    if (!activeImage) {
      throw new DomainNotFoundError("Image event not found.");
    }

    return await this.storage.getBase64ImageAsync(activeImage.id);
  }

  public async setImageInactiveByIdAsync(imageId: string) {
    await this.db.update({
      where: { id: imageId },
      data: { active: false },
    });
  }
}

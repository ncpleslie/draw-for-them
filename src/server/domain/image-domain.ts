import { ImageDomainType } from "../../types/prisma.types";
import IStorageClient from "../storage/storage-client.interface";

export default class ImageDomain {
  constructor(private db: ImageDomainType, private storage: IStorageClient) {}

  public async addImageByIdAsync(
    senderId: string,
    receiverId: string,
    imageString: string
  ) {
    const imageEvent = await this.db.create({
      data: {
        active: true,
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
      throw new Error("Image event not found.");
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

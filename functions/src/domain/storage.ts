import { App } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { v4 as uuid } from "uuid";

export default class Storage {
  constructor(private adminApp: App) {}

  public async getImageByNameAsync(name: string): Promise<Buffer> {
    const bucket = getStorage(this.adminApp).bucket();
    const file = bucket.file(`images/${name}`);
    const fileBuffer = await file.download();

    return fileBuffer[0];
  }

  public async uploadImageAsync(image: Uint8Array): Promise<void> {
    const bucket = getStorage(this.adminApp).bucket();
    const fileUuid = uuid();
    const file = bucket.file(`images/${fileUuid}.png`);
    const options = {
      resumable: false,
      contentType: "image/png",
      metadata: {
        metadata: {
          contentType: "image/png",
          firebaseStorageDownloadTokens: fileUuid,
        },
      },
    };

    // @ts-ignore
    file.save(image, options);
  }
}

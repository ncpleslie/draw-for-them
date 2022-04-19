import { App } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { v4 as uuid } from "uuid";
import AppConstant from "../constants/app.constant";

export default class Storage {
  constructor(private adminApp: App) {}

  public async getImageByNameAsync(name: string): Promise<Buffer> {
    const bucket = getStorage(this.adminApp).bucket();
    const file = bucket.file(
      `images/${name}.${AppConstant.defaultImageFormat}`
    );
    const fileBuffer = await file.download();

    return fileBuffer[0];
  }

  public async uploadImageAsync(image: Uint8Array): Promise<void> {
    const bucket = getStorage(this.adminApp).bucket();
    const fileUuid = uuid();
    const file = bucket.file(
      `images/${fileUuid}.${AppConstant.defaultImageFormat}`
    );
    const options = {
      resumable: false,
      contentType: `image/${AppConstant.defaultImageFormat}`,
      metadata: {
        metadata: {
          contentType: `image/${AppConstant.defaultImageFormat}`,
          firebaseStorageDownloadTokens: fileUuid,
        },
      },
    };

    // @ts-ignore
    file.save(image, options);
  }
}

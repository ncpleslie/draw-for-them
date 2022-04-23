import { App } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import AppConstant from "../constants/app.constant";

export default class Storage {
  constructor(private adminApp: App) {}

  public async getImageByNameAsync(filename: string): Promise<Buffer> {
    const bucket = getStorage(this.adminApp).bucket();
    const file = bucket.file(
      `images/${filename}.${AppConstant.defaultImageFormat}`
    );
    const fileBuffer = await file.download();

    return fileBuffer[0];
  }

  public async uploadImageAsync(
    image: Uint8Array,
    filename: string
  ): Promise<void> {
    const bucket = getStorage(this.adminApp).bucket();
    const file = bucket.file(
      `images/${filename}.${AppConstant.defaultImageFormat}`
    );
    const options = {
      resumable: false,
      contentType: `image/${AppConstant.defaultImageFormat}`,
      metadata: {
        metadata: {
          contentType: `image/${AppConstant.defaultImageFormat}`,
          firebaseStorageDownloadTokens: filename,
        },
      },
    };

    // @ts-ignore
    file.save(image, options);
  }
}

import IStorageClient from "./storage-client.interface";
import AppConstants from "../../../constants/app.constants";
import BaseStorageClient from "./base-storage-client";

export default class StorageClient
  extends BaseStorageClient
  implements IStorageClient
{
  constructor() {
    super();
  }

  public async storeBase64ImageAsync(
    imageId: string,
    imageString: string
  ): Promise<void> {
    const bucket = this.storage.bucket();
    const file = bucket.file(
      `images/${imageId}.${AppConstants.defaultImageFormat}`
    );
    const options = {
      resumable: false,
      contentType: `images/${AppConstants.defaultImageFormat}`,
      metadata: {
        metadata: {
          contentType: `images/${AppConstants.defaultImageFormat}`,
          firebaseStorageDownloadTokens: imageId,
        },
      },
    };

    const imageAsBase64 = imageString.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(imageAsBase64, "base64");
    const imageByteArray = new Uint8Array(imageBuffer);

    file.save(imageByteArray as Buffer, options);
  }

  public async getBase64ImageAsync(imageId: string): Promise<string> {
    const bucket = this.storage.bucket();
    const file = bucket.file(
      `images/${imageId}.${AppConstants.defaultImageFormat}`
    );
    const fileBuffer = await file.download();

    return `data:image/png;base64,${fileBuffer[0].toString("base64")}`;
  }
}

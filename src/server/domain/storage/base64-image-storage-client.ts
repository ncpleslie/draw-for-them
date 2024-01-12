import type IStorageClient from "./storage-client.interface";
import AppConstants from "../../../constants/app.constants";
import BaseStorageClient from "./base-storage-client";
import { type ServiceAccount } from "firebase-admin";

/**
 * A storage client for storing and retrieving base64 encoded images.
 */
export default class Base64ImageStorageClient
  extends BaseStorageClient
  implements IStorageClient<string>
{
  /**
   * Creates a new instance of the storage client.
   * @param config - The config.
   * @param bucket - The bucket.
   */
  constructor(config: ServiceAccount, bucket: string) {
    super(config, bucket);
  }

  public async getById(id: string): Promise<string> {
    const bucket = this.storage.bucket();
    const file = bucket.file(`images/${id}.${AppConstants.defaultImageFormat}`);
    const fileBuffer = await file.download();

    return `data:image/png;base64,${fileBuffer[0].toString("base64")}`;
  }

  public async storeById(id: string, data: string): Promise<void> {
    const bucket = this.storage.bucket();
    const file = bucket.file(`images/${id}.${AppConstants.defaultImageFormat}`);
    const options = {
      resumable: false,
      contentType: `images/${AppConstants.defaultImageFormat}`,
      metadata: {
        metadata: {
          contentType: `images/${AppConstants.defaultImageFormat}`,
          firebaseStorageDownloadTokens: id,
        },
      },
    };

    const imageAsBase64 = data.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(imageAsBase64, "base64");
    const imageByteArray = new Uint8Array(imageBuffer);

    file.save(imageByteArray as Buffer, options);
  }
}

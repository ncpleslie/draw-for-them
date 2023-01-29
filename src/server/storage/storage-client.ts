import {
  getApps,
  cert,
  initializeApp,
  ServiceAccount,
} from "firebase-admin/app";
import { getStorage, Storage } from "firebase-admin/storage";
import IStorageClient from "./storage-client.interface";
import config from "../../../firebase-config.json";
import AppConstants from "../../constants/app.constants";

export default class StorageClient implements IStorageClient {
  private storage!: Storage;

  constructor() {
    if (getApps().length) {
      return;
    }

    // TODO: Tidy this up
    // Move config to env
    const app = initializeApp(
      {
        projectId: config.project_id,
        credential: cert(config as ServiceAccount),
        storageBucket: "draw-for-them-storage.appspot.com",
      },
      "draw-for-them"
    );

    this.storage = getStorage(app);
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

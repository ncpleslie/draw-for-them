import { cert, initializeApp, ServiceAccount } from "firebase-admin/app";
import { getStorage, Storage } from "firebase-admin/storage";
import { env } from "../../../env/server.js";

export default abstract class BaseStorageClient {
  protected storage: Storage;

  constructor() {
    const config = this.createConfig();

    const app = initializeApp(
      {
        projectId: config.projectId,
        credential: cert(config),
        storageBucket: env.STORAGE_BUCKET,
      },
      config.projectId
    );

    this.storage = getStorage(app);
  }

  private createConfig(): ServiceAccount {
    return {
      projectId: env.STORAGE_PROJECT_ID,
      privateKey: env.STORAGE_PRIVATE_KEY,
      clientEmail: env.STORAGE_CLIENT_EMAIL,
    };
  }
}

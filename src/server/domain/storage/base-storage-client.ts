import type { ServiceAccount } from "firebase-admin/app";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import type { Storage } from "firebase-admin/storage";
import { getStorage } from "firebase-admin/storage";

/**
 * Base class for storage clients.
 */
export default abstract class BaseStorageClient {
  protected storage: Storage;

  /**
   * Creates a new instance of the storage client.
   * @param config - The config.
   * @param bucket - The bucket.
   */
  constructor(config: ServiceAccount, bucket: string) {
    const apps = getApps();
    if (apps.length > 0) {
      const existingApp = apps.find((app) => app.name === config.projectId);
      if (existingApp) {
        this.storage = getStorage(existingApp);
        return;
      }
    }

    const app = initializeApp(
      {
        projectId: config.projectId,
        credential: cert(config),
        storageBucket: bucket,
      },
      config.projectId
    );

    this.storage = getStorage(app);
  }

  /**
   * Generates a new config for the storage client.
   * @param storageId - The storage id.
   * @param privateKey - The private key.
   * @param clientEmail - The client email.
   * @returns - The config.
   */
  public static createConfig(
    storageId: string,
    privateKey: string,
    clientEmail: string
  ): ServiceAccount {
    return {
      projectId: storageId,
      privateKey: privateKey,
      clientEmail: clientEmail,
    };
  }
}

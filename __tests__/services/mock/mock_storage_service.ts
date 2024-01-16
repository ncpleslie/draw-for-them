import IStorageClient from "../../../src/server/domain/storage/storage-client.interface";

export default class MockStorageService implements IStorageClient<string> {
  private storage: Record<string, string> = {};

  public async getById(id: string): Promise<string> {
    return this.storage[id] || "";
  }

  public async storeById(id: string, data: string): Promise<void> {
    this.storage[id] = data;
  }
}

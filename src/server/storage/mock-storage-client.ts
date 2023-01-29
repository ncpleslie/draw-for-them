import IStorageClient from "./storage-client.interface";

export default class MockStorageClient implements IStorageClient {
  private inMemoryStorage: { [key: string]: string } = {};

  public async storeBase64ImageAsync(
    imageId: string,
    imageString: string
  ): Promise<void> {
    this.inMemoryStorage[imageId] = imageString;
  }

  public async getBase64ImageAsync(imageId: string): Promise<string> {
    if (!this.inMemoryStorage[imageId]) {
      throw new Error("Image not found");
    }

    const image = await new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(this.inMemoryStorage[imageId] as string);
      }, 100);
    });

    return image;
  }
}

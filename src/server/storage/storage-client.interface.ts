export default interface IStorageClient {
  storeBase64ImageAsync(imageId: string, imageString: string): Promise<void>;
  getBase64ImageAsync(imageId: string): Promise<string>;
}

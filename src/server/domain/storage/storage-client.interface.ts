/**
 * The storage client interface.
 */
export default interface IStorageClient<T> {
  /**
   * Gets a stored item by id.
   * @param id - The id to retrieve.
   * @returns - <T>.
   */
  getById(id: string): Promise<T>;

  /**
   * Stores <T> by id.
   * @param id - The id of the item to store.
   * @param data - The item to store.
   */
  storeById(id: string, data: T): Promise<void>;
}

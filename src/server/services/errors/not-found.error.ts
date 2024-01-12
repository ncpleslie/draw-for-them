/**
 * An error thrown when an object is not found.
 */
export default class NotFoundError extends Error {
  /**
   * Creates an instance of not found error.
   * @param reason - The reason the object is not found.
   */
  constructor(reason: string) {
    super(reason);
  }
}

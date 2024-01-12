/**
 * A validation error thrown when an object is invalid.
 */
export default class ValidationError extends Error {
  /**
   * Creates an instance of validation error.
   * @param reason - The reason the object is invalid.
   */
  constructor(reason: string) {
    super(reason);
  }
}

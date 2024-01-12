/**
 * A class that allows you to store a global reference to a value.
 */
export default class GlobalRef<T> {
  private readonly sym: symbol;

  /**
   * Creates a new global reference.
   * @param uniqueName - The unique name of the reference.
   */
  constructor(uniqueName: string) {
    this.sym = Symbol.for(uniqueName);
  }

  /**
   * Gets the value.
   */
  get value() {
    return (global as any)[this.sym] as T;
  }

  /**
   * Sets the value.
   */
  set value(value: T) {
    (global as any)[this.sym] = value;
  }
}

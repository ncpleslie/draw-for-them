export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/**
 * Awaits a delay of the specified time.
 * @param timeInMs - The time to wait in milliseconds.
 * @returns - A promise that resolves after the specified time.
 */
export const awaitableDelay = (timeInMs: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timeInMs);
  });
};

/**
 * Exclude keys from object.
 * @param record - The record to exclude keys from.
 * @param keys - The keys to exclude.
 * @returns - The record without the excluded keys.
 */
export const exclude = <T, Key extends keyof T>(
  record: T,
  keys: Key[]
): Omit<T, Key> => {
  for (const key of keys) {
    delete record[key];
  }
  return record;
};

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

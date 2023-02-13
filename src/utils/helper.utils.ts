export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export const awaitableDelay = (timeInMs: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timeInMs);
  });
};

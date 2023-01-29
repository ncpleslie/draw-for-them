export default class DomainValidationError extends Error {
  constructor(reason: string) {
    super(reason, { cause: "ENTITY FAILED VALIDATION" });
  }
}

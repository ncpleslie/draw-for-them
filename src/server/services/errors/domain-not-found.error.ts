export default class DomainNotFoundError extends Error {
  constructor(reason: string) {
    super(reason, { cause: "ENTITY NOT FOUND" });
  }
}

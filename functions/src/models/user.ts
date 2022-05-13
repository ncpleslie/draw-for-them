import BaseDbEntity from "./base-db-entity";

export default class User extends BaseDbEntity {
  constructor(
    displayName: string | undefined,
    email: string | undefined,
    uid: string
  ) {
    super();
    this.displayName = displayName || "Unknown User";
    this.email = email || "unknown email";
    this.uid = uid;
  }

  public displayName: string;
  public email: string;
  public uid: string;

  public toJSON() {
    return {
      displayName: this.displayName,
      email: this.email,
      uid: this.uid,
    };
  }
}

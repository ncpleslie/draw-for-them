import BaseDbEntity from "./base-db-entity";

export default class User extends BaseDbEntity {
  constructor(
    displayName: string | undefined,
    email: string | undefined,
    friendIds: string[],
    uid: string
  ) {
    super();
    this.displayName = displayName?.trim().toLowerCase() || "unknown user";
    this.email = email?.trim().toLowerCase() || "unknown email";
    this.friendIds = friendIds || [];
    this.uid = uid;
  }

  public displayName: string;
  public email: string;
  public friendIds: string[];
  public uid: string;

  public toJSON() {
    return {
      displayName: this.displayName,
      email: this.email,
      friendIds: this.friendIds,
      uid: this.uid,
    };
  }
}

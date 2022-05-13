export default class UserDetail {
  constructor(
    displayName: string | undefined,
    email: string | undefined,
    friendIds: string[],
    uid: string
  ) {
    this.displayName = displayName || "Unknown User";
    this.email = email || "unknown email";
    this.friendIds = friendIds || [];
    this.uid = uid;
  }

  public displayName: string;
  public email: string;
  public friendIds: string[];
  public uid: string;
}

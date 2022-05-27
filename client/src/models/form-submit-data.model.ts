export default class FormSubmitData {
  constructor(email: string, password: string, displayName = "") {
    this.email = email;
    this.password = password;
    this.displayName = displayName === "" ? null : displayName;
  }

  public email: string;
  public password: string;
  public displayName: string | null;
}

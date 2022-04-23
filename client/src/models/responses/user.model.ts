import { DocumentData } from "firebase/firestore";

export default class User {
  constructor(data: DocumentData) {
    if (!data.name) {
      throw new Error("No name found");
    }

    this.name = data.name;
  }

  public name: string;
}

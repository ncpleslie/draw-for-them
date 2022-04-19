import { DocumentData } from "firebase/firestore";

export default class DrawEvent {
  constructor(data: any) {
    this.active = data.active;
    this.imageId = data.image_id;
  }

  public active: boolean;
  public imageId: string;
}

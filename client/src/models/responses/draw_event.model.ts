export default class DrawEvent {
  constructor(data: any) {
    if (!data) {
      throw new Error("DrawEvent contains no data.");
    }

    this.active = data.active;
    this.imageId = data.imageId;
    this.sentBy = data.sentBy;
  }

  public active: boolean;
  public imageId: string;
  public sentBy: string;
}

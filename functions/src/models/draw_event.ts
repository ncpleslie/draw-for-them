export default class DrawEvent {
  constructor(active: boolean, imageId: string, sentBy: string) {
    this.active = active;
    this.imageId = imageId;
    this.sentBy = sentBy;
  }

  public active: boolean;
  public imageId: string;
  public sentBy: string;

  public toJSON() {
    return {
      active: this.active,
      imageId: this.imageId,
      sentBy: this.sentBy,
    };
  }
}

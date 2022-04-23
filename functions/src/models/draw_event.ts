export default class DrawEvent {
  constructor(active: boolean, createdBy: string, imageId: string) {
    this.active = active;
    this.createdBy = createdBy;
    this.imageId = imageId;
  }

  public active: boolean;
  public createdBy: string;
  public imageId: string;

  public toJSON() {
    return {
      active: this.active,
      created_by: this.createdBy,
      image_id: this.imageId,
    };
  }
}

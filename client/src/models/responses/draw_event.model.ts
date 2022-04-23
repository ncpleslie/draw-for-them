export default class DrawEvent {
  constructor(data: any) {
    this.active = data.active;
    this.createdBy = data.created_by;
    this.imageId = data.image_id;
  }

  public active: boolean;
  public createdBy: string;
  public imageId: string;
}

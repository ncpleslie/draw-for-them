import BaseDbEntity from "./base-db-entity";

export default class DrawEvent extends BaseDbEntity {
  constructor(active: boolean, imageId: string, sentById: string) {
    super();
    this.active = active;
    this.imageId = imageId;
    this.sentById = sentById;
  }

  public active: boolean;
  public imageId: string;
  public sentById: string;

  public toJSON() {
    return {
      active: this.active,
      imageId: this.imageId,
      sentById: this.sentById,
    };
  }
}

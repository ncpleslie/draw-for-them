import BaseDbEntity from "./base-db-entity";

export default class DrawEvent extends BaseDbEntity {
  constructor(active: boolean, imageId: string, sentBy: string) {
    super();
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

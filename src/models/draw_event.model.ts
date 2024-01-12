import type { ImageEvent, ImageEventWithSender } from "../server/domain/db/client";

export default class BaseDrawEvent {
  constructor(data: ImageEvent) {
    this.id = data.id;
    this.senderId = data.senderId;
  }

  public id: string;
  public senderId: string;

  protected toJSON() {
    return {
      id: this.id,
      senderId: this.senderId,
    };
  }
}

export class NotificationDrawEvent extends BaseDrawEvent {
  constructor(data: any);
  constructor(data: ImageEventWithSender) {
    super(data);

    if (data.sender) {
      this.senderName = data.sender.name || data.sender.email;
    } else {
      this.senderName = "an unknown user";
    }
  }

  public senderName: string;

  public toJSON() {
    const dto = super.toJSON();
    return { ...dto, senderName: this.senderName };
  }
}

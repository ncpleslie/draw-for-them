import { NotificationType } from "../enums/notification-type.enum";

export default abstract class BaseNotification {
  constructor(type: NotificationType, message: string, timeout = 6000) {
    this.message = message;
    this.type = type;
    this.timeout = timeout;
    this.id = Math.floor(100 + Math.random() * 900);
  }

  public id: number;

  public message: string;

  public timeout: number;

  public type: NotificationType;
}

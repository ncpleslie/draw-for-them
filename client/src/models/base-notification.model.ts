import { NotificationType } from "../enums/notification-type.enum";

export default abstract class BaseNotification {
  constructor(type: NotificationType, message: string, timeout = 6000) {
    this.message = message;
    this.type = type;
    this.timeout = timeout;
  }

  public message: string;

  public timeout: number;

  public type: NotificationType;
}

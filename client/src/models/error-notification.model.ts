import { NotificationType } from "../enums/notification-type.enum";
import BaseNotification from "./base-notification.model";

export default class ErrorNotification extends BaseNotification {
  constructor(message: string, timeout?: number) {
    super(NotificationType.Error, message, timeout);
  }
}

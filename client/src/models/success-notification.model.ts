import { NotificationType } from "../enums/notification-type.enum";
import BaseNotification from "./base-notification.model";

export default class SuccessNotification extends BaseNotification {
  constructor(message: string, timeout?: number) {
    super(NotificationType.Success, message, timeout);
  }
}

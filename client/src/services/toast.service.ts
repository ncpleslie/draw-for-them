import ErrorNotification from "../models/error-notification.model";
import SuccessNotification from "../models/success-notification.model";
import { store } from "../store/store";

export default class ToastService {
  public static showSuccessToast(message: string): void {
    store.notifications.push(new SuccessNotification(message));
  }

  public static showErrorToast(message: string): void {
    store.notifications.push(new ErrorNotification(message));
  }
}

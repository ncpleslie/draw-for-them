import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { NotificationType } from "../../enums/notification-type.enum";
import BaseNotification from "../../models/base-notification.model";
import { store } from "../../store/store";
import Toast from "../UI/Toast";

const ToastControl = () => {
  const { notifications } = useSnapshot(store);
  const [timer, setTimer] = useState<NodeJS.Timer>();
  const [toasts, setToasts] = useState<BaseNotification[]>([]);

  useEffect(() => {
    if (notifications.length === 0) {
      return;
    }

    const notification = notifications[0];
    openModal(notification);
    setTimer(
      setTimeout(() => {
        store.notifications.shift();
        closeModal(notification.id);
      }, notification.timeout)
    );

    return () => {
      closeModal(notification.id);
      clearTimeout(timer);
    };
  }, [notifications]);

  const closeModal = (notificationId: number): void => {
    // clearTimeout(timer);
    const newNotifications = toasts.filter(
      (toast) => toast.id !== notificationId
    );
    setToasts(newNotifications);
  };

  const openModal = async (notification: BaseNotification): Promise<void> => {
    // Add a small delay before opening, just incase there is a modal still closing.
    // This will allow the closing animation to still play.
    const delay = new Promise((resolve) => setTimeout(resolve, 300));
    await delay;
    setToasts((prev) => [...prev, notification]);
  };

  return (
    <div className="transition-all">
      {toasts.map((notification, index) => (
        <Toast
          key={index}
          order={index}
          isOpen={true}
          type={notification.type}
          message={notification.message}
          onCloseToast={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      ))}
    </div>
  );
};

export default ToastControl;

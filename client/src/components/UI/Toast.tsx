import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { NotificationType } from "../../enums/notification-type.enum";
import { store } from "../../store/store";
import Btn from "./Btn";
import Icon from "./Icon";

const Toast = () => {
  const { notifications } = useSnapshot(store);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>();
  const [toastType, setToastType] = useState<NotificationType>();

  useEffect(() => {
    if (notifications.length === 0) {
      return;
    }

    const notification = notifications[0];
    openModal(notification.message, notification.type);
    const timer = setTimeout(() => {
      store.notifications.shift();
      closeModal();
    }, notification.timeout);

    return () => {
      closeModal();
      clearTimeout(timer);
    };
  }, [notifications]);

  const closeModal = (): void => {
    setIsOpen(false);
  };

  const openModal = async (
    message: string,
    type: NotificationType
  ): Promise<void> => {
    // Add a small delay before opening, just incase there is a modal still closing.
    // This will allow the closing animation to still play.
    const delay = new Promise((resolve) => setTimeout(resolve, 300));
    await delay;
    setToastMessage(message);
    setToastType(type);
    setIsOpen(true);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <div className="relative">
        <Dialog
          as="div"
          className="absolute flex justify-center h-40 w-[500px] top-0 left-1/2 -translate-x-1/2 z-10 overflow-hidden"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={`inline-block w-full h-24 max-w-md p-6 my-4 overflow-hidden transition-all transform shadow-xl rounded-2xl ${
                toastType === NotificationType.Success && "bg-green-100"
              } ${toastType === NotificationType.Error && "bg-red-100"}`}
            >
              <div className="flex flex-row justify-between items-center">
                <div></div>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 text-center"
                >
                  {toastMessage}
                </Dialog.Title>

                <Btn
                  className="rounded-full h-12 w-12 !text-2xl focus:outline-none"
                  onClicked={closeModal}
                >
                  <Icon.Close />
                </Btn>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </div>
    </Transition>
  );
};

export default Toast;

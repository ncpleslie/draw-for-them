import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { NotificationType } from "../../enums/notification-type.enum";
import Btn from "./Btn";
import Icon from "./Icon";

interface ToastProps {
  isOpen: boolean;
  type: NotificationType;
  message: string;
  order: number;
  onCloseToast: () => void;
}

const Toast: React.FC<ToastProps> = ({
  isOpen,
  type,
  message,
  order,
  onCloseToast,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        style={{ top: order * 8 + "rem" }}
        className={`absolute left-1/2 z-10 flex h-40 w-[500px] -translate-x-1/2 overflow-hidden`}
        onClose={onCloseToast}
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
            className={`my-4 inline-block h-24 w-full max-w-md transform overflow-hidden rounded-2xl p-6 shadow-xl transition-all ${
              type === NotificationType.Success && "bg-green-100"
            } ${type === NotificationType.Error && "bg-red-100"}`}
          >
            <div className="flex flex-row items-center justify-between">
              <div></div>
              <Dialog.Title
                as="h3"
                className="text-center text-lg font-medium leading-6 text-gray-900"
              >
                {message}
              </Dialog.Title>

              <Btn
                className="h-12 w-12 rounded-full !text-2xl focus:outline-none"
                onClicked={onCloseToast}
              >
                <Icon.Close />
              </Btn>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default Toast;

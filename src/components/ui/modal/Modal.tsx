import {
  cloneElement,
  Fragment,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { create } from "zustand";
import Btn from "../Btn";
import Icon from "../Icon";
import { createRoot } from "react-dom/client";

interface ModalState {
  open: boolean;
  toggleModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  toggleModal: () => set((state) => ({ open: !state.open })),
}));

export interface BaseModalProps {
  close?: (value: any) => void;
  state?: ModalState;
}

interface ModalProps extends BaseModalProps {
  title: string;
}

const addModal = <TModal,>(
  title: string,
  body: JSX.Element,
  resolve: (value: TModal) => void
) => {
  const div = document.createElement("div");
  const root = createRoot(div);

  const close = (value: TModal) => {
    root.unmount();
    resolve(value);
  };

  const clonedBody = cloneElement(body, { close: close });

  root.render(
    <Modal close={close} title={title}>
      {clonedBody}
    </Modal>
  );
};

export const useModal = <TModal,>(
  bodyCallback: (state: ModalState) => JSX.Element,
  title: string
) => {
  const modalState = useModalStore();
  const body = bodyCallback(modalState);

  return {
    show: async () =>
      new Promise<TModal>((resolve) => {
        addModal(title, body, resolve);
      }),
  };
};

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({
  title,
  children,
  close,
}) => {
  const open = useModalStore((state) => state.open);
  const toggleModal = useModalStore((state) => state.toggleModal);

  useEffect(() => {
    toggleModal();
  }, []);

  function closeModal() {
    toggleModal();
    if (close) {
      close(false);
    }
  }

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={closeModal}>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="neu-container-raised w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-row items-center justify-between gap-4">
                    <Dialog.Title
                      as="h3"
                      className="neu-container-depressed w-full rounded-xl px-8 py-4 text-center text-lg text-icon-inactive"
                    >
                      {title}
                    </Dialog.Title>
                    <Btn className="h-12 w-12" onClicked={closeModal}>
                      <Icon.Close />
                    </Btn>
                  </div>
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;

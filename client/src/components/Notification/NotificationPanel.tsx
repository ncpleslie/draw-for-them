import { Popover, Transition } from "@headlessui/react";
import { useSnapshot } from "valtio";
import { store } from "../../store/store";
import NotificationItem from "./NotificationItem";

const NotificationPanel = () => {
  const { drawEvents } = useSnapshot(store);

  return (
    <Transition
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Popover.Panel className="absolute w-[25rem] z-10 px-4 mt-3 transform -translate-x-[23rem] left-1/2">
        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="relative flex flex-col gap-4 justify-center bg-white px-5 py-9">
            {drawEvents.map((event) => (
              <NotificationItem key={event.imageId} event={event} />
            ))}
          </div>
        </div>
      </Popover.Panel>
    </Transition>
  );
};

export default NotificationPanel;

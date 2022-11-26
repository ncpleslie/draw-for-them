import { Popover, Transition } from "@headlessui/react";
import { ImageEvent } from "@prisma/client";
import DrawEvent from "../../../models/draw_event.model";
import NotificationItem from "./NotificationItem";

interface NotificationPanelProps {
  events: ImageEvent[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ events }) => {
  return (
    <Transition
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Popover.Panel className="absolute left-1/2 mt-3 max-w-[25rem] -translate-x-[19rem] transform px-4">
        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="relative flex flex-col justify-center gap-4 bg-white py-2">
            {events.map((event) => (
              <NotificationItem key={event.id} event={event} />
            ))}
          </div>
        </div>
      </Popover.Panel>
    </Transition>
  );
};

export default NotificationPanel;
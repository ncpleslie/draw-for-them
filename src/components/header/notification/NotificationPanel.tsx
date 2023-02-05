import { Popover, Transition } from "@headlessui/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { NotificationDrawEvent } from "../../../models/draw_event.model";
import NotificationItem from "./NotificationItem";

interface NotificationPanelProps {
  events: NotificationDrawEvent[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ events }) => {
  const [parent] = useAutoAnimate({ duration: 250 });

  return (
    <Transition
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Popover.Panel className="absolute left-1/2 mt-3 w-96 -translate-x-[19rem] transform px-4">
        <div className="max-h-96 overflow-y-auto rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div
            className="relative flex flex-col justify-center gap-4 bg-white py-2"
            ref={parent}
          >
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

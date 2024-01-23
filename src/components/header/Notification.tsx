import { Popover, Transition } from "@headlessui/react";
import Link from "next/link";
import type { FC } from "react";
import type { NotificationDrawEvent } from "../../models/draw_event.model";
import Icon from "../ui/Icon";
import PopoverBtn from "../ui/PopoverBtn";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface NotificationProps {
  drawEvents: NotificationDrawEvent[];
}

const Notification: FC<NotificationProps> = ({ drawEvents }) => {
  if (!drawEvents || drawEvents?.length === 0) {
    return <></>;
  }

  return (
    <Popover className="relative z-20">
      {({ open }) => (
        <>
          <NotificationBtn count={drawEvents.length} menuOpen={open} />
          <NotificationPanel events={drawEvents} />
        </>
      )}
    </Popover>
  );
};

interface NotificationBtnProps {
  count: number;
  menuOpen: boolean;
}

const NotificationBtn: React.FC<NotificationBtnProps> = ({
  count,
  menuOpen,
}) => {
  return (
    <PopoverBtn menuOpen={menuOpen} active={count != 0}>
      <>
        <Icon.Bell />
        <div className="absolute text-sm text-white">{count}</div>
      </>
    </PopoverBtn>
  );
};

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
      <Popover.Panel className="absolute left-1/2 mt-3 w-80 -translate-x-[17.25rem] transform px-4 md:w-96 md:-translate-x-[19rem]">
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

interface NotificationItemProps {
  event: NotificationDrawEvent;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ event }) => {
  return (
    <Link
      href={`/view/${event.id}`}
      className="mx-1 flex flex-row items-center gap-4 rounded-lg px-5 py-2 text-lg hover:bg-gray-100"
    >
      <Icon.Gift />
      {`You have a new drawing from ${event.senderName}`}
    </Link>
  );
};

export default Notification;

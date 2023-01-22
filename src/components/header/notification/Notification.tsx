import { Popover } from "@headlessui/react";
import { FC } from "react";
import { NotificationDrawEvent } from "../../../models/draw_event.model";
import NotificationBtn from "./NotificationBtn";
import NotificationPanel from "./NotificationPanel";

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

export default Notification;

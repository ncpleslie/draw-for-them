import { Popover } from "@headlessui/react";
import { ImageEvent } from "@prisma/client";
import { FC } from "react";
import NotificationBtn from "./NotificationBtn";
import NotificationPanel from "./NotificationPanel";

interface NotificationProps {
  drawEvents: ImageEvent[];
}

const Notification: FC<NotificationProps> = ({ drawEvents }) => {
  if (!drawEvents || drawEvents?.length === 0) {
    return <></>;
  }

  return (
    <Popover className="relative z-20">
      <NotificationBtn count={drawEvents.length} />
      <NotificationPanel events={drawEvents} />
    </Popover>
  );
};

export default Notification;

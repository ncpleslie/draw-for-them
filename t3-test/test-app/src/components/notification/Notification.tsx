import { Popover } from "@headlessui/react";
import { ImageEvent } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import NotificationBtn from "./NotificationBtn";
import NotificationPanel from "./NotificationPanel";

const Notification = () => {
  const [drawEvents, setDrawEvents] = useState<ImageEvent[]>();
  trpc.user.getAllImagesForUser.useSubscription(undefined, {
    onData(data) {
      setDrawEvents(data);
    },
  });

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

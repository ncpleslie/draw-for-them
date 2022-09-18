import { Popover } from "@headlessui/react";
import { trpc } from "../../utils/trpc";
import NotificationBtn from "./NotificationBtn";
import NotificationPanel from "./NotificationPanel";

const Notification = () => {
  const { data: drawEvents } = trpc.useQuery(["user.getAllImagesForUser"]);

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

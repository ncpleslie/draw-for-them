import { useSnapshot } from "valtio";
import { store } from "../../store/store";
import NotificationBtn from "./NotificationBtn";
import { Popover } from "@headlessui/react";
import NotificationPanel from "./NotificationPanel";

const Notification = () => {
  const { drawEvents } = useSnapshot(store);

  if (drawEvents.length > 0) {
    return (
      <Popover className="relative">
        <NotificationBtn count={drawEvents.length} />
        <NotificationPanel />
      </Popover>
    );
  }

  return <></>;
};

export default Notification;

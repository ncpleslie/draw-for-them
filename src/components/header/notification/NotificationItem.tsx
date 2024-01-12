import Icon from "../../ui/Icon";
import Link from "next/link";
import type { NotificationDrawEvent } from "../../../models/draw_event.model";

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

export default NotificationItem;

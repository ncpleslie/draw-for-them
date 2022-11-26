import Icon from "../../ui/Icon";
import Link from "next/link";
import { ImageEvent } from "@prisma/client";

interface NotificationItemProps {
  event: ImageEvent;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ event }) => {
  return (
    <Link
      href={`/view/${event.id}`}
      className="mx-1 flex flex-row items-center gap-2 rounded-lg px-5 py-2 text-lg hover:bg-gray-100"
    >
      <Icon.Gift />
      {event.senderId && `You have a new drawing from ${event.senderId}`}
      {!event.senderId && "You have a new drawing"}
    </Link>
  );
};

export default NotificationItem;

import Icon from "../ui/Icon";
import Link from "next/link";
import { ImageEvent } from "@prisma/client";

interface NotificationItemProps {
  event: ImageEvent;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ event }) => {
  return (
    <Link href={`/view/${event.id}`}>
      <a className="flex flex-row items-center gap-2 text-lg px-5 py-2 mx-1 hover:bg-gray-100 rounded-lg">
        <Icon.Gift />
        {event.senderId && `You have a new drawing from ${event.senderId}`}
        {!event.senderId && "You have a new drawing"}
      </a>
    </Link>
  );
};

export default NotificationItem;

import { createSearchParams, useNavigate } from "react-router-dom";
import DrawEvent from "../../models/responses/draw_event.model";
import Icon from "../UI/Icon";

interface NotificationItemProps {
  event: DrawEvent;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ event }) => {
  const navigate = useNavigate();

  const handleOnNotificationItemClicked = (event: DrawEvent): void => {
    navigate({
      pathname: "/view",
      search: createSearchParams({
        imageId: event.imageId,
      }).toString(),
    });
  };

  return (
    <div className="flex flex-row items-center gap-2 text-lg">
      <Icon.Gift />
      <button onClick={() => handleOnNotificationItemClicked(event)}>
        {event.sentBy && `You have a new drawing from ${event.sentBy}`}
        {!event.sentBy && "You have a new drawing"}
      </button>
    </div>
  );
};

export default NotificationItem;

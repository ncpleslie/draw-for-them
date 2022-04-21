import { useSnapshot } from "valtio";
import { store } from "../../store/store";
import NotificationBtn from "./NotificationBtn";

const Notification = () => {
  const { activeDrawEvents } = useSnapshot(store);

  const handleOnNotificationClicked = () => {
    console.log("asd");
  };

  if (activeDrawEvents.length > 0) {
    return (
      <>
        <NotificationBtn
          count={activeDrawEvents.length}
          onClick={handleOnNotificationClicked}
        />
      </>
    );
  }

  return <></>;
};

export default Notification;

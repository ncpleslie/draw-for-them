import { useSnapshot } from "valtio";
import { store } from "../../store/store";

const Notification = () => {
  const { activeDrawEvents } = useSnapshot(store);

  if (activeDrawEvents.length > 0) {
    return <>You have {activeDrawEvents.length} notifications</>;
  }

  return <>No new notifications</>;
};

export default Notification;

import { useRouter } from "next/router";
import Btn from "../ui/Btn";
import Icon from "../ui/Icon";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notification from "./notification/Notification";
import { trpc } from "../../utils/trpc";
import { useEffect, useState } from "react";
import Menu from "./menu/Menu";
import { NotificationDrawEvent } from "../../models/draw_event.model";

const Header = ({}) => {
  const router = useRouter();
  const [drawEvents, setDrawEvents] = useState<NotificationDrawEvent[]>();

  const { data: allImages } = trpc.user.getAllImageEventsForUser.useQuery();

  trpc.user.subscribeToImageEventsForUser.useSubscription(undefined, {
    onData(data) {
      setDrawEvents(data || []);
    },
  });

  useEffect(() => {
    setDrawEvents(allImages);
  }, [allImages]);

  return (
    <div className="app-container flex flex-row justify-between px-4">
      <>
        {router.pathname !== "/" ? (
          <div className="mt-4">
            <Btn className="h-12 w-12" onClicked={() => router.push("/")}>
              <Icon.Back />
            </Btn>
          </div>
        ) : (
          <></>
        )}
        <ToastContainer />
        <div className="mt-4 flex gap-4">
          <Notification drawEvents={drawEvents || []} />
          <Menu />
        </div>
      </>
    </div>
  );
};

export default Header;

import { useRouter } from "next/router";
import Btn from "../ui/Btn";
import Icon from "../ui/Icon";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notification from "./notification/Notification";
import { trpc } from "../../utils/trpc";
import { useEffect, useState } from "react";
import Menu from "./menu/Menu";
import type { NotificationDrawEvent } from "../../models/draw_event.model";
import { Routes } from "../../enums/routes.enum";

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
    <header className="app-container flex flex-row justify-between px-4">
      <>
        {router.pathname !== Routes.Root ? (
          <div className="mt-4 flex flex-row gap-4">
            <Btn className="h-12 w-12" onClicked={() => router.back()}>
              <Icon.Back />
            </Btn>
            <Btn
              className="h-12 w-12"
              onClicked={() => router.push(Routes.Root)}
            >
              <div className="text-2xl">
                <Icon.Home />
              </div>
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
    </header>
  );
};

export default Header;

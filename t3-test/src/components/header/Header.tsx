import { useRouter } from "next/router";
import Btn from "../ui/Btn";
import Icon from "../ui/Icon";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notification from "../notification/Notification";
import { trpc } from "../../utils/trpc";
import { useEffect, useState } from "react";
import { ImageEvent } from "@prisma/client";

const Header = ({}) => {
  const router = useRouter();
  const [drawEvents, setDrawEvents] = useState<ImageEvent[]>();

  const { data: allImages } = trpc.user.getAllImagesForUser.useQuery();

  trpc.user.subToAllImagesForUser.useSubscription(undefined, {
    onData(data) {
      setDrawEvents(data || []);
    },
  });

  useEffect(() => {
    setDrawEvents(allImages);
  }, [allImages]);

  return (
    <div className="app-container flex flex-row justify-between px-4">
      {router.pathname !== "/" ? (
        <>
          <div className="mt-4">
            <Btn onClicked={() => router.push("/")}>
              <Icon.Back />
            </Btn>
          </div>
          <ToastContainer />
          <div className="mt-4">
            <Notification drawEvents={drawEvents || []} />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;

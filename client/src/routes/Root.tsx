import { useEffect, useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import DashboardBtn from "../components/UI/DashboardBtn";
import Icon from "../components/UI/Icon";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import { useHasNoFriends } from "../hooks/use-has-no-friends.hook";
import { store } from "../store/store";

export default function Root() {
  const { drawEvents } = useSnapshot(store);
  const [viewLink, setViewLink] = useState<string | null>();
  const { loadingHasNoFriends } = useHasNoFriends();

  useEffect(() => {
    if (!drawEvents || drawEvents.length === 0) {
      setViewLink(null);

      return;
    }

    const searchParams = createSearchParams({
      imageId: drawEvents[0]?.imageId,
    }).toString();

    setViewLink(`/view?${searchParams}`);
  }, [drawEvents]);

  if (loadingHasNoFriends) {
    return (
      <div className="flex h-[100vh] items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="app-container flex h-[100vh] w-[100vw] flex-row flex-wrap items-center justify-center md:flex-nowrap">
      <DashboardBtn
        className="m-4 h-[45vh] w-[90vw] md:w-[50%] xl:h-[90vh]"
        link="/draw"
      >
        <>
          <Icon.Pen />
          Draw
        </>
      </DashboardBtn>
      <DashboardBtn
        className="relative m-4 h-[45vh] w-[90vw] md:w-[50%] xl:h-[90vh]"
        disabled={!viewLink}
        link={viewLink ? viewLink : ""}
      >
        <div className="relative flex flex-col">
          {drawEvents.length > 0 ? (
            <div className="absolute right-10 -top-10 text-5xl text-icon-active">
              <Icon.Bell />
              <div className="absolute right-[0.85rem] top-[0.3rem] text-3xl text-white">
                {drawEvents.length}
              </div>
            </div>
          ) : (
            <></>
          )}
          <Icon.Image />
          View
        </div>
      </DashboardBtn>
    </div>
  );
}

import { useEffect, useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import DashboardBtn from "../components/UI/DashboardBtn";
import Icon from "../components/UI/Icon";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import UserService from "../services/user.service";
import { store } from "../store/store";

export default function Root() {
  const { drawEvents } = useSnapshot(store);
  const [loading, setLoading] = useState(false);
  const [viewLink, setViewLink] = useState<string | null>();
  const navigate = useNavigate();

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       setLoading(true);
  //       const userDetail = await UserService.getCurrentUserDetail();
  //       if (userDetail.friendIds.length === 0) {
  //         navigate({ pathname: "/add_friends" });
  //       }
  //     } catch (e) {
  //       setLoading(false);
  //       // Ignore
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="app-container h-[100vh] w-[100vw] flex flex-row justify-center items-center">
      <DashboardBtn className="h-[90vh] w-[50%] m-4" link="/draw">
        <>
          <Icon.Pen />
          Draw
        </>
      </DashboardBtn>
      <DashboardBtn
        className="relative h-[90vh] w-[50%] m-4"
        disabled={!viewLink}
        link={viewLink ? viewLink : ""}
      >
        <div className="relative flex flex-col">
          {drawEvents.length > 0 ? (
            <div className="absolute right-10 -top-10 text-5xl text-icon-active">
              <Icon.Bell />
              <div className="absolute right-[0.85rem] top-[0.3rem] text-white text-3xl">
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

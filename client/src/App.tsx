import { useEffect, useState } from "react";
import { createSearchParams } from "react-router-dom";
import { useSnapshot } from "valtio";
import DashboardBtn from "./components/UI/DashboardBtn";
import Icon from "./components/UI/Icon";
import { store } from "./store/store";

function App() {
  const { drawEvents } = useSnapshot(store);
  const [viewLink, setViewLink] = useState<string>();

  useEffect(() => {
    if (!drawEvents) {
      return;
    }

    const searchParams = createSearchParams({
      imageId: drawEvents[0]?.imageId,
    }).toString();

    setViewLink(`/view?${searchParams}`);
  }, [drawEvents]);

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

export default App;

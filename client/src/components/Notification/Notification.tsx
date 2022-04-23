import { useSnapshot } from "valtio";
import { store } from "../../store/store";
import NotificationBtn from "./NotificationBtn";
import { Popover, Transition } from "@headlessui/react";
import Icon from "../UI/Icon";
import DrawEvent from "../../models/responses/draw_event.model";
import { createSearchParams, useNavigate } from "react-router-dom";

const Notification = () => {
  const { activeDrawEvents } = useSnapshot(store);
  const navigate = useNavigate();

  const handleOnNotificationItemClicked = (event: DrawEvent): void => {
    navigate({
      pathname: "/view",
      search: createSearchParams({
        imageId: event.imageId,
      }).toString(),
    });
  };

  if (activeDrawEvents.length > 0) {
    return (
      <>
        <Popover className="relative">
          <NotificationBtn count={activeDrawEvents.length} />

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel className="absolute w-[25rem] z-10 px-4 mt-3 transform -translate-x-[23rem] left-1/2">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative flex flex-col gap-4 justify-center bg-white px-5 py-9">
                  {activeDrawEvents.map((event) => (
                    <div
                      key={event.imageId}
                      className="flex flex-row items-center gap-2 text-lg"
                    >
                      <Icon.Gift />
                      <button
                        onClick={() => handleOnNotificationItemClicked(event)}
                      >
                        You have a new drawing from {event.createdBy}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      </>
    );
  }

  return <></>;
};

export default Notification;

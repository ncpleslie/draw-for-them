import { Popover, Transition } from "@headlessui/react";
import { Routes } from "../../../enums/routes.enum";
import MenuItem from "./MenuItem";

const MenuPanel: React.FC = () => {
  return (
    <Transition
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Popover.Panel className="absolute left-1/2 mt-3 w-[20rem] -translate-x-[17.5rem] transform px-4">
        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="relative flex flex-col justify-center gap-4 bg-white">
            <MenuItem href={Routes.Profile}>Profile</MenuItem>
            <MenuItem href={Routes.AddAFriend}>Find More Friends</MenuItem>
            <MenuItem href={Routes.SignOut}>Sign Out</MenuItem>
          </div>
        </div>
      </Popover.Panel>
    </Transition>
  );
};

export default MenuPanel;

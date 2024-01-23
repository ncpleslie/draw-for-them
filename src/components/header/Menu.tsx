import { Popover, Transition } from "@headlessui/react";
import type { PropsWithChildren } from "react";
import Link from "next/link";
import Icon from "../ui/Icon";
import PopoverBtn from "../ui/PopoverBtn";
import { Routes } from "../../enums/routes.enum";

const Menu: React.FC = () => {
  return (
    <Popover className="relative z-20">
      {({ open }) => (
        <>
          <MenuBtn menuOpen={open} />
          <MenuPanel />
        </>
      )}
    </Popover>
  );
};

interface MenuBtnProps {
  menuOpen: boolean;
}

const MenuBtn: React.FC<MenuBtnProps> = ({ menuOpen }) => {
  return (
    <PopoverBtn menuOpen={menuOpen}>
      <Icon.Bars />
    </PopoverBtn>
  );
};

interface MenuItemProps {
  href: string;
}

const MenuItem: React.FC<PropsWithChildren<MenuItemProps>> = ({
  href,
  children,
}) => {
  return (
    <Link
      href={`${href}`}
      className="mx-1 flex flex-row items-center gap-2 rounded-lg px-5 py-2 text-lg hover:bg-gray-100"
    >
      {children}
    </Link>
  );
};

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

export default Menu;

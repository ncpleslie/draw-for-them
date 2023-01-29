import { PropsWithChildren } from "react";
import { Popover } from "@headlessui/react";

interface MenuBtnProps {
  menuOpen: boolean;
  active?: boolean;
}

const PopoverBtn: React.FC<PropsWithChildren<MenuBtnProps>> = ({
  active,
  menuOpen,
  children,
}) => {
  return (
    <Popover.Button
      className={` flex h-12 w-12 items-center justify-center rounded-full text-2xl text-icon-inactive ring-transparent transition-all ${
        menuOpen ? "neu-btn-small-active" : "neu-btn-small"
      } ${active && "!text-icon-active"}`}
    >
      {children}
    </Popover.Button>
  );
};

export default PopoverBtn;

import Icon from "../../ui/Icon";
import { Popover } from "@headlessui/react";
import PopoverBtn from "../../ui/PopoverBtn";

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

export default MenuBtn;

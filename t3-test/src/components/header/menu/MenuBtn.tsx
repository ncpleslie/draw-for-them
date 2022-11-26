import Icon from "../../ui/Icon";
import { Popover } from "@headlessui/react";

const MenuBtn: React.FC = () => {
  return (
    <Popover.Button className="neu-btn-small flex h-12 w-12 items-center justify-center rounded-full text-2xl text-icon-inactive transition-all">
      <Icon.Bars />
    </Popover.Button>
  );
};

export default MenuBtn;

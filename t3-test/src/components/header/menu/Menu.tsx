import { Popover } from "@headlessui/react";
import MenuBtn from "./MenuBtn";
import MenuPanel from "./MenuPanel";

const Menu: React.FC = () => {
  return (
    <Popover className="relative z-20">
      <MenuBtn />
      <MenuPanel />
    </Popover>
  );
};

export default Menu;

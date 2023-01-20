import { Popover } from "@headlessui/react";
import MenuBtn from "./MenuBtn";
import MenuPanel from "./MenuPanel";

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

export default Menu;

import { Tab } from "@headlessui/react";
import { PropsWithChildren } from "react";
import { classNames } from "../../utils/helper.utils";

interface TabBtnProps {}

const TabBtn: React.FC<PropsWithChildren<TabBtnProps>> = ({ children }) => {
  return (
    <Tab
      className={({ selected }) =>
        classNames(
          "w-full rounded-lg py-2.5 text-xl font-medium leading-5 ",
          "ring-icon-active ring-opacity-60 ring-offset-2 ring-offset-icon-active focus:outline-none",
          selected
            ? "neu-container-depressed hover: text-icon-active"
            : "text-icon-inactive shadow-sm hover:shadow"
        )
      }
    >
      {children}
    </Tab>
  );
};

export default TabBtn;

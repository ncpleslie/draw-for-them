import Icon from "../../ui/Icon";
import { Popover } from "@headlessui/react";

interface NotificationBtnProps {
  count: number;
}

const NotificationBtn: React.FC<NotificationBtnProps> = ({ count }) => {
  return (
    <Popover.Button
      className={`neu-btn-small flex h-12 w-12 items-center justify-center rounded-full text-2xl transition-all ${
        count === 0 ? "!text-icon-inactive" : "!text-icon-active"
      } `}
    >
      <Icon.Bell />
      <div className="absolute text-sm text-white">{count}</div>
    </Popover.Button>
  );
};

export default NotificationBtn;

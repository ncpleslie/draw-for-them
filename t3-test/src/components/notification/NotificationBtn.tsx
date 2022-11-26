import Icon from "../ui/Icon";
import { Popover } from "@headlessui/react";

interface NotificationBtnProps {
  count: number;
}

const NotificationBtn: React.FC<NotificationBtnProps> = ({ count }) => {
  return (
    <Popover.Button
      className={`neu-btn-small transition-all flex justify-center items-center rounded-full h-12 w-12 text-2xl ${
        count === 0 ? "!text-icon-inactive" : "!text-icon-active"
      } `}
    >
      <Icon.Bell />
      <div className="absolute text-white text-sm">{count}</div>
    </Popover.Button>
  );
};

export default NotificationBtn;

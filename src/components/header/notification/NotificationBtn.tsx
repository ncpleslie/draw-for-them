import Icon from "../../ui/Icon";
import PopoverBtn from "../../ui/PopoverBtn";

interface NotificationBtnProps {
  count: number;
  menuOpen: boolean;
}

const NotificationBtn: React.FC<NotificationBtnProps> = ({
  count,
  menuOpen,
}) => {
  return (
    <PopoverBtn menuOpen={menuOpen} active={count != 0}>
      <>
        <Icon.Bell />
        <div className="absolute text-sm text-white">{count}</div>
      </>
    </PopoverBtn>
  );
};

export default NotificationBtn;

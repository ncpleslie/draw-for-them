import Icon from "../UI/Icon";

interface NotificationBtnProps {
  count: number;
  onClick: () => void;
}

const NotificationBtn: React.FC<NotificationBtnProps> = ({
  count,
  onClick,
}) => {
  return (
    <button
      className={`neu-btn-small transition-all flex justify-center items-center rounded-full h-12 w-12 text-2xl ${
        count === 0 ? "!text-icon-inactive" : "!text-icon-active"
      } `}
      onClick={onClick}
    >
      <Icon.Bell />
      <div className="absolute text-white text-sm">{count}</div>
    </button>
  );
};

export default NotificationBtn;

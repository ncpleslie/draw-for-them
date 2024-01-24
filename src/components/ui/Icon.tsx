import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import {
  faPen,
  faCircle,
  faSquare,
  faRotateLeft,
  faTrash,
  faCloudArrowUp,
  faShapes,
  faEyeDropper,
  faChevronLeft,
  faImage,
  faBell,
  faGift,
  faXmark,
  faTriangleExclamation,
  faCircleQuestion,
  faUserPlus,
  faSpinner,
  faUser,
  faUserCheck,
  faDeleteLeft,
  faAngleUp,
  faBars,
  faTimeline,
  faUserGroup,
  faUserPen,
  faCheck,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";

const Pen: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faPen} />;
};

const Square: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faSquare} />;
};

const Circle: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faCircle} />;
};

const Undo: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faRotateLeft} />;
};

const Trash: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faTrash} />;
};

const Save: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faCloudArrowUp} />;
};

const Shapes: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faShapes} />;
};

const Color: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faEyeDropper} />;
};

const Back: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faChevronLeft} />;
};

const Image: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faImage} />;
};

const Bell: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faBell} />;
};

const Gift: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faGift} />;
};

const Close: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faXmark} />;
};

const Error: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faTriangleExclamation} />;
};

const Question: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faCircleQuestion} />;
};

const AddUser: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faUserPlus} />;
};

const Spinner: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faSpinner} />;
};

const User: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faUser} />;
};

const UserAdded: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faUserCheck} />;
};

const Delete: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faDeleteLeft} />;
};

const AngleUp: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faAngleUp} />;
};

const Bars: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faBars} />;
};

const History: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faTimeline} />;
};

const UserGroup: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faUserGroup} />;
};

const UserEdit: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faUserPen} />;
};

const Check: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faCheck} />;
};

const Home: React.FC<Omit<FontAwesomeIconProps, "icon">> = (props) => {
  return <FontAwesomeIcon {...props} icon={faHouse} />;
};

const icon = {
  Pen,
  Circle,
  Square,
  Undo,
  Trash,
  Save,
  Shapes,
  Color,
  Back,
  Image,
  Bell,
  Gift,
  Close,
  Error,
  Question,
  AddUser,
  Spinner,
  User,
  UserAdded,
  Delete,
  AngleUp,
  Bars,
  History,
  UserGroup,
  UserEdit,
  Check,
  Home,
};

export default icon;

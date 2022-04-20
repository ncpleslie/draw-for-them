import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
} from "@fortawesome/free-solid-svg-icons";

const Pen: React.FC = () => {
  return <FontAwesomeIcon icon={faPen} />;
};

const Square: React.FC = () => {
  return <FontAwesomeIcon icon={faSquare} />;
};

const Circle: React.FC = () => {
  return <FontAwesomeIcon icon={faCircle} />;
};

const Undo: React.FC = () => {
  return <FontAwesomeIcon icon={faRotateLeft} />;
};

const Trash: React.FC = () => {
  return <FontAwesomeIcon icon={faTrash} />;
};

const Save: React.FC = () => {
  return <FontAwesomeIcon icon={faCloudArrowUp} />;
};

const Shapes: React.FC = () => {
  return <FontAwesomeIcon icon={faShapes} />;
};

const Color: React.FC = () => {
  return <FontAwesomeIcon icon={faEyeDropper} />;
};

const Back: React.FC = () => {
  return <FontAwesomeIcon icon={faChevronLeft} />;
};

const Image: React.FC = () => {
  return <FontAwesomeIcon icon={faImage} />;
};

export default {
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
};

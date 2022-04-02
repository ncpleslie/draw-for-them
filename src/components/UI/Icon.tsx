import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faCircle,
  faSquare,
  faRotateLeft,
  faTrash,
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

export default { Pen, Circle, Square, Undo, Trash };

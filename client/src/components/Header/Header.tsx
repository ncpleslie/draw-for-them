import { Link } from "react-router-dom";
import Notification from "../Notification/Notification";

const Header = () => {
  return (
    <div className="flex flex-row justify-between mx-4">
      <div className="flex flex-row gap-4">
        <Link to="/draw">Draw</Link>
        <Link to="/view">View</Link>
      </div>
      <Notification />
    </div>
  );
};

export default Header;

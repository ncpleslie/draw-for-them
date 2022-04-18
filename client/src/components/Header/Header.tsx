import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <Link to="/draw">Draw</Link> | <Link to="/view">View</Link>
    </div>
  );
};

export default Header;

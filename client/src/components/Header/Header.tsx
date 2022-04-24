import { Link, useLocation, useNavigate } from "react-router-dom";
import Notification from "../Notification/Notification";
import Btn from "../UI/Btn";
import Icon from "../UI/Icon";

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="app-container flex flex-row justify-between px-4">
      {pathname !== "/" ? (
        <>
          <div className="mt-2">
            <Btn onClicked={() => navigate("/")}>
              <Icon.Back />
            </Btn>
          </div>
          <div className="mt-2">
            <Notification />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;

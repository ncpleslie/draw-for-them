import { Link, useLocation, useNavigate } from "react-router-dom";
import Notification from "../Notification/Notification";
import Btn from "../UI/Btn";
import Icon from "../UI/Icon";

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-row justify-between mx-4">
      {pathname !== "/" ? (
        <>
          <div className="mt-4">
            <Btn onClicked={() => navigate(-1)}>
              <Icon.Back />
            </Btn>
          </div>
          <Notification />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;

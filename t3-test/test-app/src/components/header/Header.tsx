import { useRouter } from "next/router";
import Btn from "../ui/Btn";
import Icon from "../ui/Icon";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notification from "../notification/Notification";

const Header = () => {
  const router = useRouter();

  return (
    <div className="app-container flex flex-row justify-between px-4">
      {router.pathname !== "/" ? (
        <>
          <div className="mt-4">
            <Btn onClicked={() => router.push("/")}>
              <Icon.Back />
            </Btn>
          </div>
          <ToastContainer />
          <div className="mt-4">
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

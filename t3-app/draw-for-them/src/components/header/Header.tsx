import { useRouter } from "next/router";
import Btn from "../ui/Btn";
import Icon from "../ui/Icon";

const Header = () => {
  const router = useRouter();

  return (
    <div className="app-container flex flex-row justify-between px-4">
      {router.pathname !== "/" ? (
        <>
          <div className="mt-4">
            <Btn onClicked={router.back}>
              <Icon.Back />
            </Btn>
          </div>
          {/* <div className="mt-4">
            <Notification />
          </div> */}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;

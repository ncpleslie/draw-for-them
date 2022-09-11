import { useEffect } from "react";
import UserService from "../services/user.service";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await UserService.signOut();
      navigate({ pathname: "/login" });
    })();
  }, []);

  return <>Logging out...</>;
};

export default Logout;

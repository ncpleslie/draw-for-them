import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { store } from "../../store/store";

const RequireAuth: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useSnapshot(store);

  useEffect(() => {
    if (!user) {
      navigate({ pathname: "/login" });

      return;
    }
  }, [user]);

  return children;
};

export default RequireAuth;

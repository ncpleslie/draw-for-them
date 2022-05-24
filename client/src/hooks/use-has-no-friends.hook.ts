import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import UserService from "../services/user.service";
import { store } from "../store/store";

let hasChecked = false;

export const useHasNoFriends = () => {
  const [loadingHasNoFriends, setLoadingHasNoFriends] = useState(false);
  const { user } = useSnapshot(store);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasChecked) {
      return;
    }

    (async () => {
      setLoadingHasNoFriends(true);
      await redirectIfUser();
      hasChecked = true;
      setLoadingHasNoFriends(false);
    })();
  }, [user]);

  const redirectIfUser = async (): Promise<void> => {
    if (user) {
      const userDetail = await UserService.getCurrentUserDetail();

      if (userDetail.friendIds.length === 0) {
        navigate({ pathname: "/add_friends" });

        return;
      }

      navigate({ pathname: "/" });

      return;
    }
  };

  return { loadingHasNoFriends, redirectIfUser };
};

import { useEffect, useState } from "react";
import UserDetail from "../models/user-detail.model";
import UserService from "../services/user.service";

export default function AddFriends() {
  const [foundUser, setFoundUser] = useState<UserDetail>();

  useEffect(() => {
    (async () => {
      const foundUser = await UserService.searchUserByDisplayName("A user");
      console.log(foundUser);
      setFoundUser(foundUser);
    })();
  }, []);
  return (
    <div className="app-container h-[100vh] w-[100vw] flex flex-row justify-center items-center">
      Add a friend
      {foundUser && foundUser.displayName}
    </div>
  );
}

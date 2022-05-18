import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Btn from "../components/UI/Btn";
import Icon from "../components/UI/Icon";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import UserDetail from "../models/user-detail.model";
import UserService from "../services/user.service";

export default function AddFriends() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [foundUser, setFoundUser] = useState<UserDetail>();
  const [addingFriend, setAddingFriend] = useState(false);
  const [friendAdded, setFriendAdded] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   (async () => await redirectIfHasFriends())();
  // }, []);

  const handleFriendSearch = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      friend: { value: string };
    };

    try {
      setFoundUser(undefined);
      setLoading(true);
      setError(false);
      const foundUser = await UserService.searchUserByDisplayName(
        target.friend.value
      );
      setFoundUser(foundUser);
    } catch (e) {
      setLoading(false);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAFriend = async () => {
    if (!foundUser || friendAdded) {
      return;
    }

    try {
      setAddingFriend(true);
      await UserService.addAFriend(foundUser.uid);
      setAddingFriend(false);
      setFriendAdded(true);
      await redirectIfHasFriends();
    } catch (e) {
      setAddingFriend(false);
    }
  };

  const redirectIfHasFriends = async (): Promise<void> => {
    const userDetail = await UserService.getCurrentUserDetail();

    if (userDetail.friendIds.length > 0) {
      navigate({ pathname: "/" });
    }
  };

  return (
    <div className="app-container h-[100vh] w-[100vw] flex flex-row justify-center items-center gap-10">
      <div className="neu-container-raised rounded-xl h-72 w-72 flex flex-col justify-center items-center gap-6">
        <div className="">
          <h1 className="text-2xl">You have no friends!</h1>
          <h2 className="text-lg">Why not make some now?</h2>
        </div>
        <form onSubmit={handleFriendSearch} className="flex flex-col gap-4">
          <label htmlFor="friend">Search for a friend... if you have any</label>
          <input
            className="neu-container rounded-xl px-3 py-2 focus:outline-none focus:border-icon-active text-icon-hover"
            id="friend"
            type="search"
          />
          <Btn type="submit" onClicked={() => {}}>
            Search
          </Btn>
        </form>
      </div>
      {loading && (
        <div>
          <LoadingIndicator />
        </div>
      )}

      {error && (
        <div className="neu-container-raised rounded-xl h-30 w-72 flex flex-row justify-center items-center gap-4">
          <div className="text-5xl text-icon-inactive">
            <Icon.Question />
          </div>
          <div>
            <p>Unable to find you any friends.</p>
            <p>Maybe you need to search harder?</p>
          </div>
        </div>
      )}

      {foundUser && (
        <div className="neu-container-raised rounded-xl h-72 w-72 flex flex-col justify-center items-center gap-4 py-4 ">
          <h3 className="text-2xl">You've found a friend!</h3>
          <div
            className="flex flex-col justify-center items-center gap-4"
            onClick={handleAddAFriend}
          >
            <div className="neu-container rounded p-4 text-5xl text-icon-inactive">
              <Icon.User />
            </div>

            <div>
              <p>Name: {foundUser.displayName}</p>
              <p>Email: {foundUser.email}</p>
            </div>

            <Btn
              onClicked={handleAddAFriend}
              active={!addingFriend}
              className="h-[48px] w-[62px]"
            >
              {addingFriend && (
                <div className="animate-spin duration-1000 flex justify-center items-center">
                  <Icon.Spinner />
                </div>
              )}
              {friendAdded && (
                <div className="flex justify-center items-center text-icon-active">
                  <Icon.UserAdded />
                </div>
              )}
              {!addingFriend && !friendAdded && <Icon.AddUser />}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

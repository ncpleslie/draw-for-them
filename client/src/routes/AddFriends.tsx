import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Keyboard from "../components/Keyboard/Keyboard";
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
  const [searchInputValue, setSearchInputValue] = useState("");
  const [focused, setFocused] = React.useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => await redirectIfHasFriends())();
  }, []);

  const handleFriendSearch = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFocused(false);

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
      console.error(e);
      setLoading(false);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const onFocus = () => setFocused(true);

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
      console.error(e);
      setAddingFriend(false);
    }
  };

  const redirectIfHasFriends = async (): Promise<void> => {
    const userDetail = await UserService.getCurrentUserDetail();

    if (userDetail.friendIds.length > 0) {
      navigate({ pathname: "/" });
    }
  };

  const handleKeyboardKeyEntered = (key: string) => {
    if (key === "<") {
      setSearchInputValue((prev: string) => prev.slice(0, -1));

      return;
    }

    setSearchInputValue((prev: string) => (prev += key));

    console.log(searchInputValue);
  };

  return (
    <div className="app-container flex h-[100vh] w-[100vw] flex-row items-center justify-center gap-10">
      <div className="neu-container-raised flex h-72 w-72 flex-col items-center justify-center gap-6 rounded-xl">
        <div className="">
          <h1 className="text-2xl">You have no friends!</h1>
          <h2 className="text-lg">Why not make some now?</h2>
        </div>
        <form onSubmit={handleFriendSearch} className="flex flex-col gap-4">
          <label htmlFor="friend">Search for a friend... if you have any</label>
          <input
            onFocus={onFocus}
            className="neu-container rounded-xl px-3 py-2 text-icon-hover focus:border-icon-active focus:outline-none"
            id="friend"
            type="search"
            value={searchInputValue}
          />
          <Btn type="submit" onClicked={() => {}}>
            Search
          </Btn>
        </form>
      </div>

      {loading && (
        <div className="flex w-[400px] items-center justify-center">
          <LoadingIndicator />
        </div>
      )}

      {error && !focused && (
        <div className="neu-container-raised flex h-40 w-[400px] flex-row items-center justify-center gap-4 rounded-xl">
          <div className="text-5xl text-icon-inactive">
            <Icon.Question />
          </div>
          <div>
            <p>Unable to find you any friends.</p>
            <p>Maybe you need to search harder?</p>
          </div>
        </div>
      )}

      {focused && !loading && (
        <div className="neu-container-raised w-[400px] rounded-xl">
          <Keyboard onKeyEntered={handleKeyboardKeyEntered} />
        </div>
      )}

      {foundUser && (
        <div className="neu-container-raised flex h-72 w-[400px] flex-col items-center justify-center gap-4 rounded-xl py-4 ">
          <h3 className="text-2xl">You've found a friend!</h3>
          <div
            className="flex flex-col items-center justify-center gap-4"
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
                <div className="flex animate-spin items-center justify-center duration-1000">
                  <Icon.Spinner />
                </div>
              )}
              {friendAdded && (
                <div className="flex items-center justify-center text-icon-active">
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

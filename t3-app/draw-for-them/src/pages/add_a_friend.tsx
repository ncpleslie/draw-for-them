import { NextPage } from "next";
import { ChangeEvent, useState } from "react";
import Btn from "../components/ui/Btn";
import FocusableInput from "../components/ui/FocusableInput";
import Icon from "../components/ui/Icon";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import UserDetail from "../models/user-detail.model";

const AddAFriend: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [foundUser, setFoundUser] = useState<UserDetail>();
  const [addingFriend, setAddingFriend] = useState(false);
  const [friendAdded, setFriendAdded] = useState(false);
  const [_, setSearchInputValue] = useState("");
  const [focused, setFocused] = useState(false);
  // const { loadingHasNoFriends, redirectIfUser } = useHasNoFriends();

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
      // const foundUser = await UserService.searchUserByDisplayName(
      //   target.friend.value
      // );
      //   setFoundUser(foundUser);
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
      // await UserService.addAFriend(foundUser.uid);
      setAddingFriend(false);
      setFriendAdded(true);
      //   await redirectIfUser();
    } catch (e) {
      console.error(e);
      setAddingFriend(false);
    }
  };

  const onChange = (e: ChangeEvent) => {
    const input = e.nativeEvent as InputEvent;
    const key = input.data as string;

    if (!key) {
      setSearchInputValue((prev: string) => prev.slice(0, -1));

      return;
    }

    setSearchInputValue((prev: string) => (prev += key));
  };

  return (
    <div className="app-container flex h-[100vh] w-[100vw] flex-row flex-wrap items-center justify-center gap-10 pb-10">
      <div className="neu-container-raised flex h-72 w-72 flex-col items-center justify-center gap-6 rounded-xl">
        <div>
          <h1 className="text-2xl">You have no friends!</h1>
          <h2 className="text-lg">Why not make some now?</h2>
        </div>
        <form onSubmit={handleFriendSearch} className="flex flex-col gap-4">
          <label htmlFor="friend">Search for a friend... if you have any</label>
          <FocusableInput
            type={"search"}
            id={"friend"}
            placeholder={""}
            onChange={onChange}
            onFocus={onFocus}
          />

          <Btn type="submit" className="pt-0" onClicked={() => {}}>
            Search
          </Btn>
        </form>
      </div>

      {/* {(loading || loadingHasNoFriends) && (
        <div className="flex w-72 items-center justify-center">
          <LoadingIndicator />
        </div>
      )} */}

      {error && !focused && (
        <div className="neu-container-raised flex h-40 w-72 flex-row items-center justify-center gap-4 rounded-xl">
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
        <div className="neu-container-raised flex h-72 w-72 flex-col items-center justify-center gap-4 rounded-xl py-4">
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
};

export default AddAFriend;

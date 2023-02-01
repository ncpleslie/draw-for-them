import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Btn from "../components/ui/Btn";
import FocusableInput from "../components/ui/FocusableInput";
import Icon from "../components/ui/Icon";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import { trpc } from "../utils/trpc";

const AddAFriend: NextPage = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const {
    data: foundUser,
    isError,
    isFetching: searchFriendLoading,
    refetch,
  } = trpc.user.getUserByName.useQuery(
    { name: searchInput },
    {
      enabled: false,
    }
  );

  const {
    mutate: mutateAddFriend,
    isLoading: addFriendLoading,
    isSuccess: addFriendSuccess,
  } = trpc.user.addUserAsFriendById.useMutation({});

  const handleFriendSearch = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    refetch();
  };

  const handleAddAFriend = async () => {
    if (!foundUser || addFriendSuccess) {
      return;
    }

    mutateAddFriend({ id: foundUser.id });
  };

  useEffect(() => {
    if (addFriendSuccess) {
      router.replace("/");
    }
  }, [addFriendSuccess]);

  return (
    <div className="app-container flex max-h-full min-h-screen w-screen flex-row flex-wrap items-center justify-center gap-10 pb-10">
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
            placeholder={"What's your \"friend's\" name?"}
            required
            onChange={(e) =>
              setSearchInput((e.target as HTMLInputElement).value)
            }
          />

          <Btn type="submit" className="pt-0">
            Search
          </Btn>
        </form>
      </div>

      {searchFriendLoading && <LoadingIndicator />}

      {isError && (
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
          <h3 className="text-2xl">You have found a friend!</h3>
          <div
            className="flex flex-col items-center justify-center gap-4"
            onClick={handleAddAFriend}
          >
            <div className="neu-container rounded p-4 text-5xl text-icon-inactive">
              <Icon.User />
            </div>

            <div>
              {foundUser.name && <p>Name: {foundUser.name}</p>}
              <p>Email: {foundUser.email}</p>
            </div>

            <Btn
              onClicked={handleAddAFriend}
              active={!addFriendLoading}
              className="h-12 w-48"
              loading={addFriendLoading}
            >
              {addFriendSuccess && (
                <div className="flex items-center justify-center text-icon-active">
                  <Icon.UserAdded />
                </div>
              )}
              {!addFriendLoading && !addFriendSuccess && <Icon.AddUser />}
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAFriend;
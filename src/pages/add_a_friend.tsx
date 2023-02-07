import { User } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Btn from "../components/ui/Btn";
import FocusableInput from "../components/ui/FocusableInput";
import Icon from "../components/ui/Icon";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import { Routes } from "../enums/routes.enum";
import { trpc } from "../utils/trpc";

const AddAFriend: NextPage = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const {
    data: foundUsers,
    isError,
    isFetched,
    isFetching: searchFriendLoading,
    refetch,
  } = trpc.user.getUsersByName.useQuery(
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

  const handleAddAFriend = async (user: User) => {
    if (!foundUsers?.length || addFriendSuccess) {
      return;
    }

    mutateAddFriend({ id: user.id });
  };

  useEffect(() => {
    if (addFriendSuccess) {
      router.replace(Routes.Root);
    }
  }, [addFriendSuccess]);

  return (
    <div className="app-container max-w-screen flex max-h-full min-h-screen flex-col flex-wrap items-center pt-8">
      <div className="flex h-full w-full flex-col items-center justify-center gap-8 md:h-1/2 md:w-1/2">
        <div className="neu-container-raised flex h-full w-full flex-col items-center justify-center gap-6 rounded-xl p-4 ">
          <div>
            <h1 className="text-2xl">You have no friends!</h1>
            <h2 className="text-lg">Why not make some now?</h2>
          </div>
          <form onSubmit={handleFriendSearch} className="flex flex-col gap-4">
            <label htmlFor="friend">
              Search for a friend... if you have any
            </label>
            <FocusableInput
              type={"search"}
              id={"friend"}
              placeholder={"What's your \"friend's\" name?"}
              required
              onChange={(e) =>
                setSearchInput((e.target as HTMLInputElement).value)
              }
            />

            <Btn type="submit" className="mt-4 pt-0">
              Search
            </Btn>
          </form>
        </div>

        {searchFriendLoading && <LoadingIndicator />}

        {!isFetched && (
          <div className="neu-container-raised flex w-full flex-row items-center justify-center gap-4 rounded-xl p-4">
            <div className="text-5xl text-icon-inactive">
              <Icon.Question />
            </div>
            <div>
              <p>How about searching for some friends</p>
            </div>
          </div>
        )}

        {isError ||
          (foundUsers?.length === 0 && isFetched && (
            <div className="neu-container-raised flex w-full flex-row items-center justify-center gap-4 rounded-xl p-4">
              <div className="text-5xl text-icon-inactive">
                <Icon.Question />
              </div>
              <div>
                <p>Unable to find you any friends.</p>
                <p>Maybe no one wants to be your friend?</p>
              </div>
            </div>
          ))}

        {foundUsers && foundUsers.length > 0 && (
          <div className="neu-container-raised flex w-full flex-col items-center  gap-4 rounded-xl py-4">
            <h3 className="text-2xl">We have found you some friends!</h3>

            {foundUsers.map((user) => (
              <div
                key={user.id}
                className="neu-container-depressed flex flex-col items-center justify-center gap-4 rounded-xl p-8"
                onClick={() => handleAddAFriend(user)}
              >
                <div className="neu-container rounded p-4 text-5xl text-icon-inactive">
                  <Icon.User />
                </div>

                <div>
                  {user.name && <p>Name: {user.name}</p>}
                  <p>Email: {user.email}</p>
                </div>

                <Btn
                  onClicked={() => handleAddAFriend(user)}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAFriend;

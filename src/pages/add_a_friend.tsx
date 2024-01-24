import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { InferGetServerSidePropsType, NextPage } from "next";
import { useState } from "react";
import FadeIn from "../components/transitions/FadeIn";
import Btn from "../components/ui/Btn";
import FocusableInput from "../components/ui/FocusableInput";
import Icon from "../components/ui/Icon";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import { Routes } from "../enums/routes.enum";
import AuthAppShell from "../layout/AuthAppShell";
import { createContext } from "../server/trpc/context";
import { trpc } from "../utils/trpc";
import { type Friend } from "../server/domain/db/client";

export async function getServerSideProps(context: CreateNextContextOptions) {
  const ctx = await createContext(context);

  if (!ctx.session || !ctx.session.user) {
    return {
      redirect: {
        destination: Routes.SignIn,
        permanent: false,
      },
    };
  }

  const profile = await ctx.userService.getUserProfileAsync(
    ctx.session.user.id
  );

  return {
    props: {
      friends: profile.friends,
    },
  };
}

const AddAFriend: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ friends }) => {
  const [searchInput, setSearchInput] = useState("");
  const [friendId, setFriendId] = useState("");

  const {
    data: foundUsers,
    error: searchFriendError,
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
    isPending: addFriendLoading,
    isSuccess: addFriendSuccess,
  } = trpc.user.addUserAsFriendById.useMutation({});

  const handleFriendSearch = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    refetch();
  };

  const handleAddAFriend = async (user: Friend) => {
    if (!foundUsers?.length || addFriendSuccess) {
      return;
    }

    setFriendId(user.id);
    mutateAddFriend({ id: user.id });
  };

  return (
    <AuthAppShell>
      <div className="flex h-full flex-col items-center justify-start">
        <div className="neu-container-raised mt-8 mb-6 flex  w-[90dvw] flex-col items-center justify-center gap-6 rounded-xl p-4 text-center md:m-8    md:w-1/2">
          <div>
            <h1 className="text-2xl">
              {friends?.length > 0
                ? `You have ${friends?.length} friend${
                    friends?.length === 1 ? "!" : "s!"
                  }`
                : "You have no friends!"}
            </h1>
            <h2 className="text-lg">Why not make some more now?</h2>
          </div>
          <form onSubmit={handleFriendSearch} className="flex flex-col gap-4">
            <label htmlFor="friend">
              Search for a friend... if you have any
            </label>
            <p className="italic">Note: You can add yourself as a friend</p>
            <FocusableInput
              type={"search"}
              id={"friend"}
              placeholder={"What's your \"friend's\" name?"}
              required
              onChange={(e) =>
                setSearchInput((e.target as HTMLInputElement).value)
              }
            />
            {searchFriendError && (
              <div className="neu-container-raised-error mt-4 rounded-lg p-2 text-center">
                {searchFriendError?.shape?.data?.zodError?.fieldErrors?.name?.map(
                  (error: string) => (
                    <p key={error}>{error}</p>
                  )
                )}
              </div>
            )}
            <div className="flex w-full flex-row justify-center gap-4">
              <Btn type="submit" className="mt-4 grow pt-0">
                Search
              </Btn>
              {addFriendSuccess && (
                <Btn
                  type="link"
                  title={`Continue to home`}
                  href={Routes.Root}
                  className="mt-4 pt-0"
                >
                  Done
                </Btn>
              )}
            </div>
          </form>
        </div>

        <FadeIn show={searchFriendLoading}>
          <div className="m-4">
            <LoadingIndicator />
          </div>
        </FadeIn>

        <FadeIn show={!isFetched && !searchFriendLoading}>
          <div className="neu-container-raised flex h-full w-[90dvw] flex-col items-center justify-center gap-6 rounded-xl p-4 md:m-4 md:w-1/2">
            <div className="text-5xl text-icon-inactive">
              <Icon.Question />
            </div>
            <div>
              <p>How about searching for some friends</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn
          show={
            (searchFriendError || (foundUsers?.length === 0 && isFetched)) &&
            !searchFriendLoading
          }
        >
          <div className="neu-container-raised flex h-full w-[90dvw] flex-col items-center justify-center gap-6 rounded-xl p-4 text-center md:m-4 md:w-1/2">
            <div className="text-5xl text-icon-inactive">
              <Icon.Question />
            </div>
            <div>
              <p>Unable to find you any friends.</p>
              <p>Maybe no one wants to be your friend?</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn
          show={!!foundUsers && foundUsers.length > 0 && !searchFriendLoading}
        >
          {!!foundUsers && foundUsers.length > 0 && (
            <div className="neu-container-raised flex h-full w-[90dvw] flex-col items-center justify-center gap-2 rounded-xl p-4 md:m-4 md:w-1/2 md:gap-6">
              <h3 className="text-center text-lg md:text-2xl">
                We have found you some friends!
              </h3>
              <div className="flex w-full flex-col gap-4">
                {foundUsers.map((user) => (
                  <FoundFriendPanel
                    key={user.id}
                    user={user}
                    loading={addFriendLoading && friendId === user.id}
                    successfullyAdded={addFriendSuccess && friendId === user.id}
                    addFriend={handleAddAFriend}
                  />
                ))}
              </div>
            </div>
          )}
        </FadeIn>
      </div>
    </AuthAppShell>
  );
};

interface FoundFriendPanelProps {
  user: Friend;
  loading: boolean;
  successfullyAdded: boolean;
  addFriend: (user: Friend) => void;
}

const FoundFriendPanel: React.FC<FoundFriendPanelProps> = ({
  user,
  loading,
  successfullyAdded,
  addFriend,
}) => {
  return (
    <div
      key={user.id}
      className="neu-container-depressed flex flex-row items-center justify-between gap-4 rounded-xl p-4 md:p-8"
      onClick={() => addFriend(user)}
    >
      <div>
        <p className="text-bold text-lg md:text-2xl">{user.name}</p>
      </div>

      <Btn
        onClicked={() => addFriend(user)}
        active={!loading}
        className="h-12 w-12"
        loading={loading}
      >
        {successfullyAdded && (
          <div className="flex items-center justify-center text-2xl text-icon-active">
            <Icon.UserAdded />
          </div>
        )}
        {!loading && !successfullyAdded && (
          <div className="text-2xl">
            <Icon.AddUser />
          </div>
        )}
      </Btn>
    </div>
  );
};

export default AddAFriend;

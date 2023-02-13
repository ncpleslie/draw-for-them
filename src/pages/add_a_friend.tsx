import { User } from "@prisma/client";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { InferGetServerSidePropsType, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FadeIn from "../components/transitions/FadeIn";
import Btn from "../components/ui/Btn";
import FocusableInput from "../components/ui/FocusableInput";
import Icon from "../components/ui/Icon";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import { Routes } from "../enums/routes.enum";
import AuthAppShell from "../layout/AuthAppShell";
import { createContext } from "../server/trpc/context";
import { trpc } from "../utils/trpc";

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
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
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
    <AuthAppShell>
      <div className="flex flex-col items-center justify-center">
        <div className="neu-container-raised m-4 flex h-full w-full flex-col items-center justify-center gap-6 rounded-xl p-4 text-center md:h-1/2 md:w-1/2">
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
            <Btn type="submit" className="mt-4 pt-0">
              Search
            </Btn>
          </form>
        </div>

        <FadeIn show={searchFriendLoading}>
          <div className="m-4">
            <LoadingIndicator />
          </div>
        </FadeIn>

        <FadeIn show={!isFetched && !searchFriendLoading}>
          <div className="neu-container-raised m-4 flex h-full w-full flex-col items-center justify-center gap-6 rounded-xl p-4 md:h-1/2 md:w-1/2">
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
          <div className="neu-container-raised m-4 flex h-full w-full flex-col items-center justify-center gap-6 rounded-xl p-4 text-center md:h-1/2 md:w-1/2">
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
            <div className="neu-container-raised m-4 flex max-h-[50vh] w-full flex-col items-center justify-center gap-6 rounded-xl p-4 md:h-1/2 md:w-1/2">
              <h3 className="text-2xl">We have found you some friends!</h3>
              <div className="flex w-full flex-col gap-4 overflow-y-auto">
                {foundUsers!.map((user) => (
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
                      {!addFriendLoading && !addFriendSuccess && (
                        <Icon.AddUser />
                      )}
                    </Btn>
                  </div>
                ))}
              </div>
            </div>
          )}
        </FadeIn>
      </div>
    </AuthAppShell>
  );
};

export default AddAFriend;

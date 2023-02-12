import { Disclosure, Transition } from "@headlessui/react";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { InferGetServerSidePropsType, NextPage } from "next";
import { useRouter } from "next/router";
import { use, useEffect, useState } from "react";
import Btn from "../components/ui/Btn";
import FocusableInput from "../components/ui/FocusableInput";
import Icon from "../components/ui/Icon";
import { BaseModalProps, useModal } from "../components/ui/modal/Modal";
import { Routes } from "../enums/routes.enum";
import AuthAppShell from "../layout/AuthAppShell";
import { createContext } from "../server/trpc/context";
import { ArrayElement } from "../utils/helper.utils";
import { RouterOutputs, trpc } from "../utils/trpc";

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
      user: ctx.session.user.id,
      profile,
    },
  };
}

interface FriendHistoryModalBodyProps extends BaseModalProps {
  friend?: RouterOutputs["user"]["getHistoryByUserId"];
}

const FriendHistoryModalBody: React.FC<FriendHistoryModalBodyProps> = ({
  friend,
  state,
  close,
}) => {
  const closeModal = () => {
    if (close) {
      close(null);
      state?.toggleModal();
    }
  };

  return (
    <div className="mt-8 flex flex-col justify-center gap-4 text-icon-inactive">
      <div className="flex flex-row justify-between">
        <p>Sent to {friend?.friends[0]?.name}</p>
        <p>({friend?.sentImages.length})</p>
      </div>
      <div className="neu-container-depressed rounded-xl p-4">
        {friend?.sentImages.map((sent) => (
          <p key={sent.id}>
            {sent.date.toLocaleString()} - {sent.active ? "unopened" : "opened"}
          </p>
        ))}
      </div>
      <div className="flex flex-row justify-between">
        <p>Received from {friend?.friends[0]?.name}</p>
        <p>({friend?.receivedImages.length})</p>
      </div>
      <div className="neu-container-depressed rounded-xl p-4">
        {friend?.receivedImages.map((received) => (
          <p key={received.id}>{received.date.toLocaleString()}</p>
        ))}
      </div>
    </div>
  );
};

const Profile: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ profile }) => {
  const router = useRouter();
  const [name, setName] = useState(profile?.name);
  const [selectedFriend, setSelectedFriend] =
    useState<ArrayElement<typeof profile.friends>>();
  const [showFriends, setShowFriends] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const utils = trpc.useContext();

  const {
    data: updateProfileData,
    mutate: mutateUpdateProfile,
    isLoading: isLoadingEdit,
    error,
  } = trpc.user.updateUserProfile.useMutation({});

  const handleFriendSearch = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    mutateUpdateProfile({ name: nameInput });
  };

  useEffect(() => {
    if (updateProfileData && updateProfileData.name) {
      setName(updateProfileData.name);
    }
  }, [updateProfileData]);

  const { data, refetch } = trpc.user.getHistoryByUserId.useQuery(
    { friendId: selectedFriend?.id || "" },
    {
      enabled: false,
    }
  );

  const { show: showFriendHistoryModal } = useModal(
    (state) => <FriendHistoryModalBody friend={data} state={state} />,
    selectedFriend?.name || ""
  );

  useEffect(() => {
    if (selectedFriend) {
      refetch();
    }

    return () => {
      utils.user.getHistoryByUserId.invalidate({
        friendId: selectedFriend?.id || "",
      });
    };
  }, [selectedFriend]);

  useEffect(() => {
    (async () => {
      if (data) {
        await showFriendHistoryModal();
      }
    })();

    return () => {
      setSelectedFriend(undefined);
    };
  }, [data]);

  const onProfileEditClicked = async () => {
    setShowFriends(false);
    setShowEdit((prev) => !prev);
  };

  const onFriendListClicked = async () => {
    setShowEdit(false);
    setShowFriends((prev) => !prev);
  };

  if (!profile) {
    return <div>Error loading profile! Please try again.</div>;
  }

  return (
    <AuthAppShell>
      <div className="flex flex-col items-center justify-center">
        <div className="neu-container-raised m-8 flex h-full w-full flex-col items-center justify-center gap-6 rounded-xl p-4 md:h-1/2 md:w-1/2">
          <div className="text-center">
            <h1 className="text-2xl">Hello there, {name}</h1>
          </div>

          <div className="flex w-full flex-row items-start justify-center gap-8">
            <Btn title="Edit profile" onClicked={onProfileEditClicked}>
              <Icon.UserEdit />
            </Btn>
            <Btn title="Show friends" onClicked={onFriendListClicked}>
              <Icon.UserGroup />
            </Btn>
            <Btn
              title="Add a new friend"
              onClicked={() => router.push(Routes.AddAFriend)}
            >
              <Icon.AddUser />
            </Btn>
          </div>
        </div>
        <Transition
          className="flex w-full justify-center"
          enter="transition duration-300 ease-out"
          enterFrom="transform -translate-y-4 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform -translate-y-4 opacity-0"
          show={showFriends}
        >
          <div className="neu-container-raised m-8 flex h-full w-full flex-col items-center justify-center gap-6 rounded-xl p-4 md:h-1/2 md:w-1/2">
            <h2>Friends ({profile.friends.length})</h2>

            {profile.friends.map((friend) => (
              <div
                onClick={() => setSelectedFriend(friend)}
                typeof="button"
                tabIndex={1}
                className="neu-btn flex w-full cursor-pointer flex-row items-center justify-between rounded-xl p-4 text-xl"
                key={friend.id}
                title={`Show timeline for ${friend.name}`}
              >
                <p>{friend.name}</p>
                <Btn
                  title={`Show timeline for ${friend.name}`}
                  onClicked={() => setSelectedFriend(friend)}
                >
                  <Icon.History />
                </Btn>
              </div>
            ))}
          </div>
        </Transition>

        <Transition
          className="flex w-full justify-center"
          enter="transition duration-300 ease-out"
          enterFrom="transform -translate-y-4 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform -translate-y-4 opacity-0"
          show={showEdit}
        >
          <div className="neu-container-raised m-8 flex h-full w-full flex-col items-center justify-center gap-6 rounded-xl p-4 transition-all duration-500 md:h-1/2 md:w-1/2">
            <h2 className="text-lg">Edit Profile</h2>
            <form
              onSubmit={handleFriendSearch}
              className="flex w-full flex-col items-center justify-center gap-4 md:w-1/2 "
            >
              <label htmlFor="friend">Name</label>
              <FocusableInput
                type={"text"}
                id={"name"}
                placeholder={"What's your name?"}
                onChange={(e) =>
                  setNameInput((e.target as HTMLInputElement).value)
                }
              />
              {error && (
                <div className="neu-container-raised-error mt-4 rounded-lg p-2 text-center">
                  <p>{error?.shape?.data.zodError?.formErrors}</p>
                </div>
              )}
              <Btn type="submit" className="mt-4" loading={isLoadingEdit}>
                <Icon.Check />
              </Btn>
            </form>
          </div>
        </Transition>
      </div>
    </AuthAppShell>
  );
};

export default Profile;

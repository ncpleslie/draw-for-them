import { Disclosure, Transition } from "@headlessui/react";
import { inferRouterOutputs } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { InferGetServerSidePropsType, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Icons } from "react-toastify";
import AppShell from "../components/AppShell";
import Header from "../components/header/Header";
import Btn from "../components/ui/Btn";
import Icon from "../components/ui/Icon";
import { BaseModalProps, useModal } from "../components/ui/modal/Modal";
import { Routes } from "../enums/routes.enum";
import { createContext } from "../server/trpc/context";
import { AppRouter } from "../server/trpc/router/_app";
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
        <p>Sent to {friend?.name}</p>
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
        <p>Received from {friend?.name}</p>
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
> = ({ user, profile }) => {
  const router = useRouter();
  const [selectedFriend, setSelectedFriend] =
    useState<ArrayElement<typeof profile.friends>>();

  const utils = trpc.useContext();

  const { data, refetch, isLoading } = trpc.user.getHistoryByUserId.useQuery(
    { friendId: selectedFriend?.id || "" },
    {
      enabled: false,
    }
  );

  const { show } = useModal(
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
        await show();
      }
    })();

    return () => {
      setSelectedFriend(undefined);
    };
  }, [data]);

  if (!profile) {
    return <div>Error loading profile! Please try again.</div>;
  }

  return (
    <AppShell>
      <div className="flex flex-row flex-wrap items-start justify-center gap-10 pb-10">
        <div className="neu-container-raised m-8 flex h-full w-full flex-col items-center justify-center gap-6 rounded-xl p-4 md:h-1/2 md:w-1/2">
          <div className="text-center">
            <h1 className="text-2xl">Hello there, {profile.name}</h1>
          </div>
          <div className="flex w-full flex-row items-start gap-4">
            <Disclosure
              as={"div"}
              className="flex w-full flex-col justify-center"
            >
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={`${
                      open
                        ? "neu-btn-depressed rounded-xl"
                        : "neu-btn rounded-xl transition-all"
                    } flex w-full flex-row justify-between p-4`}
                    style={{
                      paddingBottom: `${
                        open
                          ? (26 + profile.friends.length * 4) / 4 + "rem"
                          : "1rem"
                      }`,
                    }}
                  >
                    <p>Friends ({profile.friends.length})</p>
                    <div
                      className={`${open ? "" : "rotate-180"} transition-all`}
                    >
                      <Icon.AngleUp />
                    </div>
                  </Disclosure.Button>
                  <Transition
                    className="h-0"
                    enter="transition duration-300 ease-out"
                    enterFrom="transform -translate-y-4 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform -translate-y-4 opacity-0"
                  >
                    <Disclosure.Panel
                      className="h-0 p-4"
                      style={{
                        translate: `0 -${
                          (26 + profile.friends.length * 4) / 4
                        }rem`,
                      }}
                    >
                      {profile.friends.map((friend) => (
                        <div
                          onClick={() => setSelectedFriend(friend)}
                          typeof="button"
                          tabIndex={1}
                          className="neu-btn flex cursor-pointer flex-row items-center justify-between rounded-xl p-4 text-xl"
                          key={friend.id}
                        >
                          <p>{friend.name}</p>
                          <Btn onClicked={() => setSelectedFriend(friend)}>
                            <Icon.History />
                          </Btn>
                        </div>
                      ))}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
            <Btn
              onClicked={() => router.push(Routes.AddAFriend)}
              className="h-14 w-20"
            >
              <Icon.AddUser />
            </Btn>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Profile;

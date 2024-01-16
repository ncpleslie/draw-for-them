import type { NextPage } from "next";
import type { GetSessionParams } from "next-auth/react";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import FullScreenCenter from "../components/ui/FullScreenCenter";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import { Routes } from "../enums/routes.enum";
import { trpc } from "../utils/trpc";
import { toast } from "react-toastify";
import type { BaseModalProps } from "../components/ui/modal/Modal";
import { useModal } from "../components/ui/modal/Modal";
import type { User } from "@prisma/client";
import Icon from "../components/ui/Icon";
import AuthAppShell from "../layout/AuthAppShell";
import { Friend } from "../server/domain/db/client";

const DrawingArea = dynamic(() => import("../components/draw/DrawingArea"), {
  ssr: false,
  loading: () => (
    <FullScreenCenter>
      <LoadingIndicator />
    </FullScreenCenter>
  ),
});

export async function getServerSideProps(
  context: GetSessionParams | undefined
) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: Routes.SignIn,
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

interface UserSelectModalBodyProps extends BaseModalProps {
  isLoading: boolean;
  friends?: Friend[];
}

const UserSelectModalBody: React.FC<UserSelectModalBodyProps> = ({
  isLoading,
  friends,
  state,
  close,
}) => {
  const onUserSelected = (user: Friend) => {
    if (close) {
      close(user);
      state?.toggleModal();
    }
  };

  if (isLoading) {
    return <div>Finding friends...</div>;
  }

  return (
    <div className="mt-8 flex max-h-[70vh] flex-row flex-wrap justify-center gap-4">
      {friends?.map((friend) => (
        <button
          className="neu-btn-small w-full rounded-2xl text-icon-inactive transition-all duration-300 hover:bg-slate-100/50 active:text-icon-active"
          onClick={() => onUserSelected(friend)}
          key={friend.id}
        >
          <div className="flex flex-row items-center gap-8 p-4">
            <div className="text-5xl">
              <Icon.User />
            </div>
            <p className="w-full truncate text-2xl text-[2.5vh]">
              {friend.name || "Unnamed Friend"}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

const Draw: NextPage = () => {
  const sendImage = trpc.user.sendUserImage.useMutation();
  const { isLoading, data } = trpc.user.getFriends.useQuery();
  const { show } = useModal<User>(
    (state) => (
      <UserSelectModalBody isLoading={isLoading} friends={data} state={state} />
    ),
    "Send To"
  );

  const onSave = async (image: string) => {
    if (!data || !data.length) {
      return;
    }

    try {
      let selectedFriendId = data[0]!.id;
      if (data.length > 1) {
        const selectedFriend = await show();
        if (!selectedFriend) {
          return;
        }

        selectedFriendId = selectedFriend.id;
      }

      await sendImage.mutateAsync({
        userId: selectedFriendId,
        imageData: image,
      });
      toast.success("That masterpiece was sent!");
    } catch (e) {
      console.error(e);
      toast.error(
        "Oops! Something went wrong. Please try send that masterpiece again."
      );
    }
  };

  return (
    <AuthAppShell>
      <Suspense>
        <DrawingArea onSave={onSave} />
      </Suspense>
    </AuthAppShell>
  );
};

export default Draw;

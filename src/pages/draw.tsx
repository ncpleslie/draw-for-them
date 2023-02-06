import { NextPage } from "next";
import { getSession, GetSessionParams } from "next-auth/react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Header from "../components/header/Header";
import FullScreenCenter from "../components/ui/FullScreenCenter";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import { Routes } from "../enums/routes.enum";
import { trpc } from "../utils/trpc";
import { toast } from "react-toastify";
import {
  BaseModalProps,
  useModal,
  useModalStore,
} from "../components/ui/modal/Modal";
import { User } from "@prisma/client";
import Icon from "../components/ui/Icon";

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
  friends?: User[];
}

const UserSelectModalBody: React.FC<UserSelectModalBodyProps> = ({
  isLoading,
  friends,
  state,
  close,
}) => {
  const onUserSelected = (user: User) => {
    if (close) {
      close(user);
      state?.toggleModal();
    }
  };

  if (isLoading) {
    return <div>Finding friends...</div>;
  }

  return (
    <div className="mt-8 flex justify-center">
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
            <p className="text-2xl">{friend.name || friend.email}</p>
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
    try {
      const selectedFriend = await show();
      if (!selectedFriend) {
        return;
      }

      await sendImage.mutateAsync({
        userId: selectedFriend.id,
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
    <main className="app-container h-screen overflow-hidden">
      <Header />
      <Suspense>
        <DrawingArea onSave={onSave} />
      </Suspense>
    </main>
  );
};

export default Draw;

import { User } from "@prisma/client";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { InferGetServerSidePropsType, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import EditDetail from "../components/profile/EditDetail";
import FriendsDetail from "../components/profile/FriendsDetail";
import SlideDownFade from "../components/transitions/SlideDownFade";
import Btn from "../components/ui/Btn";
import Icon from "../components/ui/Icon";
import { Routes } from "../enums/routes.enum";
import AuthAppShell from "../layout/AuthAppShell";
import { createContext } from "../server/trpc/context";

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

const Profile: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ profile }) => {
  const router = useRouter();

  const [name, setName] = useState(profile?.name);
  const [showFriends, setShowFriends] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const onProfileEdit = (user: User) => {
    setName(user.name);
  };

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

        <SlideDownFade show={showEdit}>
          <EditDetail onNameEdited={onProfileEdit} />
        </SlideDownFade>

        <SlideDownFade show={showFriends}>
          <FriendsDetail friends={profile.friends} />
        </SlideDownFade>
      </div>
    </AuthAppShell>
  );
};

export default Profile;

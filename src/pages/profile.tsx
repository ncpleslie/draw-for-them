import { Disclosure, Transition } from "@headlessui/react";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { InferGetServerSidePropsType, NextPage } from "next";
import { useRouter } from "next/router";
import { Icons } from "react-toastify";
import Header from "../components/header/Header";
import Btn from "../components/ui/Btn";
import Icon from "../components/ui/Icon";
import { Routes } from "../enums/routes.enum";
import { createContext } from "../server/trpc/context";
import { router } from "../server/trpc/trpc";

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
> = ({ user, profile }) => {
  const router = useRouter();

  if (!profile) {
    return <div>Error loading profile! Please try again.</div>;
  }

  return (
    <>
      <main className="app-container h-full">
        <Header />
        <div className="flex max-h-full min-h-screen w-screen flex-row flex-wrap items-start justify-center gap-10 pb-10">
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
                          <>
                            <p key={friend.id}>{friend.name}</p>
                          </>
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
            <p>Sent</p>
            {profile.sentImages.map((sent) => (
              <p key={sent.id}>
                {sent.receiverId} at {sent.date.toString()}
              </p>
            ))}
            <p>Received</p>
            {profile.receivedImages.map((sent) => (
              <p key={sent.id}>
                {sent.senderId} at {sent.date.toString()}
              </p>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;

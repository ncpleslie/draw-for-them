import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { InferGetServerSidePropsType, NextPage } from "next";
import Header from "../components/header/Header";
import { Routes } from "../enums/routes.enum";
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

  console.log(profile);

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
  return (
    <>
      <main className="app-container h-screen">
        <Header />
        <div className="flex w-screen flex-row flex-wrap items-center justify-center md:flex-nowrap">
          {JSON.stringify(user)}
          {JSON.stringify(profile)}
        </div>
      </main>
    </>
  );
};

export default Profile;

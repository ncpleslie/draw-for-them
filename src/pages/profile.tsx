import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { InferGetServerSidePropsType, NextPage } from "next";
import Header from "../components/header/Header";
import { Routes } from "../enums/routes.enum";
import { createContext } from "../server/trpc/context";

export async function getServerSideProps(context: CreateNextContextOptions) {
  const ctx = await createContext(context);

  const userId = ctx.session?.user?.id;
  if (!userId) {
    // Redirect user
    return {
      redirect: {
        destination: Routes.SignIn,
        permanent: false,
      },
    };
  }

  // GET USER DATA HERE

  if (!ctx.session) {
    return {
      redirect: {
        destination: Routes.SignIn,
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: userId,
    },
  };
}

const Profile: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user }) => {
  return (
    <>
      <main className="app-container h-screen">
        <Header />
        <div className="flex w-screen flex-row flex-wrap items-center justify-center md:flex-nowrap">
          {user}
        </div>
      </main>
    </>
  );
};

export default Profile;

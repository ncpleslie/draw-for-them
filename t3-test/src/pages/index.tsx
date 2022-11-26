import { ImageEvent } from "@prisma/client";
import type { InferGetServerSidePropsType, NextPage } from "next";
import { signOut, getSession, GetSessionParams } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import DashboardBtn from "../components/ui/DashboardBtn";
import Icon from "../components/ui/Icon";
import { getAllUserImages } from "../server/trpc/router/user";
import { trpc } from "../utils/trpc";
import { createContext } from "../server/trpc/context";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";

export async function getServerSideProps(context: CreateNextContextOptions) {
  const ctx = await createContext(context);
  const allImages = (await getAllUserImages(ctx)) || [];

  if (!ctx.session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session: ctx.session, allImages },
  };
}

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ allImages }) => {
  const [viewLink, setViewLink] = useState<string | null>();
  const [drawEvents, setDrawEvents] = useState<ImageEvent[]>(allImages);
  trpc.user.subToAllImagesForUser.useSubscription(undefined, {
    onData(data) {
      setDrawEvents(data || []);
      createViewLink(data || []);
    },
  });

  useEffect(() => {
    createViewLink(allImages);
  }, []);

  const createViewLink = (images: ImageEvent[]) => {
    if (images?.length === 0) {
      setViewLink(null);
      return;
    }

    setViewLink(`/view/${images[0]?.id}`);
  };

  return (
    <>
      <Head>
        <title>Draw For Them</title>
        <meta
          name="description"
          content="Draw For Them - An realtime drawing application"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button className="absolute" onClick={() => signOut()}>
        Sign Out
      </button>

      <main className="app-container flex h-[100vh] w-[100vw] flex-row flex-wrap items-center justify-center md:flex-nowrap">
        <DashboardBtn
          className="m-4 h-[45vh] w-[90vw] md:w-[50%] xl:h-[90vh]"
          link="/draw"
        >
          <>
            <Icon.Pen />
            Draw
          </>
        </DashboardBtn>
        <DashboardBtn
          className="relative m-4 h-[45vh] w-[90vw] md:w-[50%] xl:h-[90vh]"
          disabled={!viewLink}
          link={viewLink ? viewLink : ""}
        >
          <div className="relative flex flex-col">
            {drawEvents && drawEvents.length > 0 ? (
              <div className="absolute right-10 -top-10 text-5xl text-icon-active">
                <Icon.Bell />
                <div className="absolute right-[0.85rem] top-[0.3rem] text-3xl text-white">
                  {drawEvents.length}
                </div>
              </div>
            ) : (
              <></>
            )}
            <Icon.Image />
            View
          </div>
        </DashboardBtn>
      </main>
    </>
  );
};

export default Home;

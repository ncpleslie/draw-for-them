import type { NextPage } from "next";
import { signOut, getSession, GetSessionParams } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import DashboardBtn from "../components/ui/DashboardBtn";
import Icon from "../components/ui/Icon";
import { trpc } from "../utils/trpc";

export async function getServerSideProps(
  context: GetSessionParams | undefined
) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

const Home: NextPage = () => {
  const [viewLink, setViewLink] = useState<string | null>();
  const { data: drawEvents } = trpc.useQuery(["user.getAllImagesForUser"]);

  useEffect(() => {
    if (drawEvents?.length === 0) {
      setViewLink(null);
      return;
    }

    setViewLink(`/view/${drawEvents?.[0]?.id}`);
  }, [drawEvents]);

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

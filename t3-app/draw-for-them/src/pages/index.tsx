import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardBtn from "../components/ui/DashboardBtn";
import FullScreenCenter from "../components/ui/FullScreenCenter";
import Icon from "../components/ui/Icon";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  const [viewLink, setViewLink] = useState<string | null>();
  const [drawEvents] = useState<string[] | undefined>();

  useEffect(() => {
    if (!session) {
      router.replace("/signin");
    }
  }, [session, router]);

  if (!session) {
    return (
      <FullScreenCenter>
        <LoadingIndicator />
      </FullScreenCenter>
    );
  }

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

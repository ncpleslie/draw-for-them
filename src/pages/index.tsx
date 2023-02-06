import type { InferGetServerSidePropsType, NextPage } from "next";
import { useEffect, useState } from "react";
import DashboardBtn from "../components/ui/DashboardBtn";
import Icon from "../components/ui/Icon";
import { trpc } from "../utils/trpc";
import { createContext } from "../server/trpc/context";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { Routes } from "../enums/routes.enum";
import Header from "../components/header/Header";
import { NotificationDrawEvent } from "../models/draw_event.model";

export async function getServerSideProps(context: CreateNextContextOptions) {
  const ctx = await createContext(context);

  const allImages = [];

  try {
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
    const imageEvents =
      (await ctx.userService.getAllImageEventsForUserAsync(userId)) || [];

    const images = imageEvents?.map(
      (image) => new NotificationDrawEvent(image)
    );

    allImages.push(...images);
  } catch (err) {
    console.error(err);
  }

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
      session: ctx.session,
      allImages: allImages?.map((image) => image.toJSON()),
    },
  };
}

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ allImages }) => {
  const [viewLink, setViewLink] = useState<string | null>();
  const [drawEvents, setDrawEvents] = useState<NotificationDrawEvent[]>();

  trpc.user.subscribeToImageEventsForUser.useSubscription(undefined, {
    onData(data) {
      setDrawEvents(data || []);
      createViewLink(data || []);
    },
  });

  useEffect(() => {
    const drawEvents = allImages.map(
      (image) => new NotificationDrawEvent(image)
    );

    createViewLink(drawEvents);
    setDrawEvents(drawEvents);
  }, [allImages]);

  const createViewLink = (images: NotificationDrawEvent[]) => {
    if (images?.length === 0) {
      setViewLink(null);
      return;
    }

    setViewLink(`/view/${images[0]?.id}`);
  };

  return (
    <>
      <main className="app-container h-screen">
        <Header />
        <div className="flex w-screen flex-row flex-wrap items-center justify-center md:h-[90dvh] md:flex-nowrap">
          <DashboardBtn
            className="m-4 h-[42dvh] w-[90dvw] md:w-[50%] xl:h-[85dvh]"
            link="/draw"
          >
            <>
              <Icon.Pen />
              Draw
            </>
          </DashboardBtn>
          <DashboardBtn
            className="relative m-4 h-[42dvh] w-[90dvw] md:w-[50%] xl:h-[85dvh]"
            disabled={!viewLink}
            link={viewLink ? viewLink : ""}
          >
            <div className="relative flex flex-col">
              {drawEvents && drawEvents.length > 0 ? (
                <div className="absolute right-10 -top-10 grid grid-cols-1 grid-rows-1 place-items-center text-5xl text-icon-active">
                  <div className="z-20 col-start-1 col-end-1 row-start-1 row-end-1 text-3xl text-white">
                    {drawEvents.length}
                  </div>
                  <div className="z-10 col-start-1 col-end-1 row-start-1 row-end-1">
                    <Icon.Bell />
                  </div>
                </div>
              ) : (
                <></>
              )}
              <Icon.Image />
              View
            </div>
          </DashboardBtn>
        </div>
      </main>
    </>
  );
};

export default Home;

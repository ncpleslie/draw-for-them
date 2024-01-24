import type { InferGetServerSidePropsType, NextPage } from "next";
import { useEffect, useState } from "react";
import DashboardBtn from "../components/ui/DashboardBtn";
import Icon from "../components/ui/Icon";
import { trpc } from "../utils/trpc";
import { createContext } from "../server/trpc/context";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { Routes } from "../enums/routes.enum";
import { NotificationDrawEvent } from "../models/draw_event.model";
import AuthAppShell from "../layout/AuthAppShell";

export async function getServerSideProps(context: CreateNextContextOptions) {
  const ctx = await createContext(context);
  const allImages = [];

  try {
    const user = ctx.session?.user;
    if (!user?.id) {
      return {
        redirect: {
          destination: Routes.SignIn,
          permanent: false,
        },
      };
    }

    if (!user?.name) {
      return {
        redirect: {
          destination: Routes.NewUser,
          permanent: false,
        },
      };
    }

    const imageEvents =
      (await ctx.userService.getAllImageEventsForUserAsync(user?.id)) || [];

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

    setViewLink(`${Routes.View}/${images[0]?.id}`);
  };

  return (
    <AuthAppShell>
      <div className="flex w-screen flex-row flex-wrap items-center justify-center md:h-[90dvh] md:flex-nowrap">
        <DashboardBtn
          className="m-4 min-h-[39dvh] w-[90dvw] md:w-[50%] xl:h-[85dvh]"
          link={Routes.Draw}
        >
          <div className="flex flex-col items-center justify-center text-8xl md:text-9xl">
            <Icon.Pen />
            Draw
          </div>
        </DashboardBtn>
        <DashboardBtn
          className="relative m-4 min-h-[39dvh] w-[90dvw] md:w-[50%] xl:h-[85dvh]"
          disabled={!viewLink}
          link={viewLink ? viewLink : ""}
        >
          <div className="relative flex flex-col text-8xl md:text-9xl">
            {drawEvents && drawEvents.length > 0 ? (
              <div className="absolute right-7 -top-5 grid grid-cols-1 grid-rows-1 place-items-center text-5xl text-icon-active md:right-10 md:-top-10">
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
    </AuthAppShell>
  );
};

export default Home;

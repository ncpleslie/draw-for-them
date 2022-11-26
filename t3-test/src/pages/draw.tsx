import { NextPage } from "next";
import { getSession, GetSessionParams } from "next-auth/react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Header from "../components/header/Header";
import FullScreenCenter from "../components/ui/FullScreenCenter";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import { Routes } from "../enums/routes.enum";

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

const Draw: NextPage = () => {
  return (
    <main className="app-container h-[100vh] overflow-hidden">
      <Header />
      <Suspense>
        <DrawingArea />
      </Suspense>
    </main>
  );
};

export default Draw;

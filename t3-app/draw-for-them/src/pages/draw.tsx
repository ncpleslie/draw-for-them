import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Header from "../components/header/Header";
import FullScreenCenter from "../components/ui/FullScreenCenter";
import LoadingIndicator from "../components/ui/LoadingIndicator";
const DrawingArea = dynamic(() => import("../components/draw/DrawingArea"), {
  ssr: false,
  loading: () => (
    <FullScreenCenter>
      <LoadingIndicator />
    </FullScreenCenter>
  ),
});

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

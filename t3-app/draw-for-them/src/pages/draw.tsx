import { NextPage } from "next";
import dynamic from "next/dynamic";
import Header from "../components/header/Header";
const DrawingArea = dynamic(() => import("../components/draw/DrawingArea"), {
  ssr: false,
});

const Draw: NextPage = () => {
  return (
    <main className="app-container h-[100vh] overflow-hidden">
      <Header />
      <DrawingArea />
    </main>
  );
};

export default Draw;

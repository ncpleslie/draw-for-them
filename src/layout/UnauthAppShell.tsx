import { PropsWithChildren } from "react";
import Header from "../components/header/Header";

const UnauthAppShell: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <main className="app-container h-screen h-[100dvh] overflow-hidden overflow-y-hidden text-icon-inactive">
        {children}
      </main>
    </>
  );
};

export default UnauthAppShell;

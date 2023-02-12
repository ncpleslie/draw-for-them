import { PropsWithChildren } from "react";
import Header from "../components/header/Header";

const AuthAppShell: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <main className="app-container h-screen overflow-hidden text-icon-inactive">
        <Header />
        {children}
      </main>
    </>
  );
};

export default AuthAppShell;

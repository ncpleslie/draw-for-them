import type { PropsWithChildren } from "react";
import Header from "../components/header/Header";

const AuthAppShell: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <main className="app-container overflow-x-hidden text-icon-inactive h-d-screen">
        <Header />
        {children}
      </main>
    </>
  );
};

export default AuthAppShell;

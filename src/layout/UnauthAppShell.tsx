import type { PropsWithChildren } from "react";

const UnauthAppShell: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <main className="app-container overflow-x-hidden text-icon-inactive h-d-screen">
        {children}
      </main>
    </>
  );
};

export default UnauthAppShell;

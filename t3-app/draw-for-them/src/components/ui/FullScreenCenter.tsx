import { PropsWithChildren } from "react";

const FullScreenCenter: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex h-[100vh] items-center justify-center">{children}</div>
  );
};

export default FullScreenCenter;

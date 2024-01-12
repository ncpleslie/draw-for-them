import type { PropsWithChildren } from "react";

interface FullScreenCenterProps {
  className?: string;
}

const FullScreenCenter: React.FC<PropsWithChildren<FullScreenCenterProps>> = ({
  className,
  children,
}) => {
  return (
    <div
      className={`${className} absolute top-0 flex h-[100vh] w-[100vw] items-center justify-center`}
    >
      {children}
    </div>
  );
};

export default FullScreenCenter;

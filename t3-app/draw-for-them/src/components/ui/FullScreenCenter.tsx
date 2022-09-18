import { PropsWithChildren } from "react";

interface FullScreenCenterProps {
  className?: string;
}

const FullScreenCenter: React.FC<PropsWithChildren<FullScreenCenterProps>> = ({
  className,
  children,
}) => {
  return (
    <div
      className={`${className} flex h-[100vh] items-center justify-center absolute top-0`}
    >
      {children}
    </div>
  );
};

export default FullScreenCenter;

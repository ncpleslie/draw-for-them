import { PropsWithChildren } from "react";

interface BtnProps {
  onClicked: () => void;
  active?: boolean;
  className?: string;
}

const Btn: React.FC<PropsWithChildren<BtnProps>> = ({
  active,
  children,
  className,
  onClicked,
}) => {
  const onClick = () => {
    onClicked();
  };

  return (
    <button
      className={`${className} bg-blue-500 hover:bg-blue-700 transition duration-300 ease-in-out hover:translate-y-1 active:scale-105 text-white text-2xl py-2 px-4 rounded`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Btn;

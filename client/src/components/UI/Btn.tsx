import { PropsWithChildren } from "react";

interface BtnProps {
  onClicked: () => void;
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const Btn: React.FC<PropsWithChildren<BtnProps>> = ({
  children,
  style,
  className,
  onClicked,
}) => {
  return (
    <button
      style={style}
      className={`neu-btn-small bg-blue-500 hover:bg-blue-700 transition ease-in-out hover:scale-110 active:scale-105 text-white text-2xl py-2 px-4 rounded ${className}`}
      onClick={onClicked}
    >
      {children}
    </button>
  );
};

export default Btn;

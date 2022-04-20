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
      className={`neu-btn-small transition-all text-white text-2xl py-2 px-4 rounded ${className}`}
      onClick={onClicked}
    >
      {children}
    </button>
  );
};

export default Btn;

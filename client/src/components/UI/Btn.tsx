import { PropsWithChildren } from "react";

interface BtnProps {
  onClicked: () => void;
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset" | undefined;
}

const Btn: React.FC<PropsWithChildren<BtnProps>> = ({
  children,
  style,
  className,
  type,
  onClicked,
}) => {
  return (
    <button
      style={style}
      className={`neu-btn-small flex flex-col justify-center items-center transition-all text-white text-4xl py-2 px-4 rounded-full ${className}`}
      onClick={onClicked}
      type={type || "button"}
    >
      {children}
    </button>
  );
};

export default Btn;

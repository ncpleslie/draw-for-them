import { PropsWithChildren } from "react";
import Icon from "./Icon";

interface BtnProps {
  onClicked?: () => void;
  loading?: boolean;
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
  loading,
  onClicked,
}) => {
  const btnContent = loading ? (
    <div className="flex animate-spin items-center justify-center duration-1000">
      <Icon.Spinner />
    </div>
  ) : (
    children
  );

  return (
    <button
      style={style}
      className={`neu-btn-small flex flex-col justify-center items-center transition-all text-white text-4xl pb-2 pt-1 px-4 rounded-full ${className}`}
      onClick={onClicked}
      type={type || "button"}
    >
      {btnContent}
    </button>
  );
};

export default Btn;

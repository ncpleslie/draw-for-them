import { PropsWithChildren } from "react";
import Icon from "./Icon";

interface BtnProps {
  onClicked?: () => void;
  title?: string;
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
  title,
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
      title={title}
      style={style}
      className={`neu-btn-small flex flex-col items-center justify-center rounded-full px-4 pb-2 pt-2 text-4xl text-white transition-all ${className}`}
      onClick={onClicked}
      type={type || "button"}
    >
      {btnContent}
    </button>
  );
};

export default Btn;

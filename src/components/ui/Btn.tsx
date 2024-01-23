import type { PropsWithChildren } from "react";
import Icon from "./Icon";
import Link from "next/link";

type BtnProps =
  | {
      onClicked?: () => void;
      title?: string;
      loading?: boolean;
      active?: boolean;
      className?: string;
      style?: React.CSSProperties;
    } & (
      | {
          type?: "button" | "submit" | "reset";
        }
      | {
          href: string;
          type: "link";
        }
    );

const Btn: React.FC<PropsWithChildren<BtnProps>> = (props) => {
  const btnContent = props.loading ? (
    <div className="flex animate-spin items-center justify-center duration-1000">
      <Icon.Spinner />
    </div>
  ) : (
    props.children
  );

  if (props.type === "link") {
    return (
      <Link
        href={props.href}
        title={props.title}
        style={props.style}
        className={`neu-btn-small flex flex-col items-center justify-center rounded-full px-4 pb-2 pt-2 text-4xl text-white transition-all ${props.className}`}
      >
        {btnContent}
      </Link>
    );
  }

  return (
    <button
      title={props.title}
      style={props.style}
      className={`neu-btn-small flex flex-col items-center justify-center rounded-full px-4 pb-2 pt-2 text-4xl text-white transition-all ${props.className}`}
      onClick={props.onClicked}
      type={props.type || "button"}
    >
      {btnContent}
    </button>
  );
};

export default Btn;

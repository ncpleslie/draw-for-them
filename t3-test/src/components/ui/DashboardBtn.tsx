import { PropsWithChildren } from "react";
import Link from "next/link";

interface DashboardBtnProps {
  className?: string;
  link: string;
  disabled?: boolean;
}

const DashboardBtn: React.FC<PropsWithChildren<DashboardBtnProps>> = (
  props
) => {
  return (
    <Link
      href={!props.disabled ? props.link : "#"}
      className={`${props.className} 
    neu-btn flex flex-col items-center justify-center rounded-3xl text-9xl text-white transition-all ${
      props.disabled && "neu-btn-disabled cursor-default !text-gray-300"
    }`}
    >
      {props.children}
    </Link>
  );
};

export default DashboardBtn;

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
    <Link href={!props.disabled ? props.link : "#"}>
      <a
        className={`${props.className} 
      flex flex-col justify-center items-center neu-btn text-white transition-all rounded-3xl text-9xl ${
        props.disabled && "cursor-default neu-btn-disabled !text-gray-300"
      }`}
      >
        {props.children}
      </a>
    </Link>
  );
};

export default DashboardBtn;

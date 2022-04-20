import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

interface DashboardBtnProps {
  className?: string;
  link: string;
}

const DashboardBtn: React.FC<PropsWithChildren<DashboardBtnProps>> = (
  props
) => {
  return (
    <Link
      className={`${props.className} 
      flex flex-col justify-center items-center neu-btn rounded-3xl`}
      to={props.link}
    >
      {props.children}
    </Link>
  );
};

export default DashboardBtn;

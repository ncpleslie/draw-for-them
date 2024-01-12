import Link from "next/link";
import type { PropsWithChildren } from "react";

interface MenuItemProps {
  href: string;
}

const MenuItem: React.FC<PropsWithChildren<MenuItemProps>> = ({
  href,
  children,
}) => {
  return (
    <Link
      href={`${href}`}
      className="mx-1 flex flex-row items-center gap-2 rounded-lg px-5 py-2 text-lg hover:bg-gray-100"
    >
      {children}
    </Link>
  );
};

export default MenuItem;

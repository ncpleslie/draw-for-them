import { Transition } from "@headlessui/react";
import type { PropsWithChildren } from "react";

interface FadeInProps {
  show: boolean;
}

const FadeIn: React.FC<PropsWithChildren<FadeInProps>> = ({
  children,
  show,
}) => {
  return (
    <Transition
      className="flex w-full justify-center"
      enter="transition duration-300 ease-out"
      enterFrom="transform opacity-0"
      enterTo="transform scale-100 opacity-100"
      show={show}
    >
      {children}
    </Transition>
  );
};

export default FadeIn;

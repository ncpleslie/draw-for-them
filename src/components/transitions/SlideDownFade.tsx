import { Transition } from "@headlessui/react";
import type { PropsWithChildren } from "react";

interface SlideDownFadeProps {
  show: boolean;
}

const SlideDownFade: React.FC<PropsWithChildren<SlideDownFadeProps>> = ({
  children,
  show,
}) => {
  return (
    <Transition
      className="flex w-full justify-center"
      enter="transition duration-300 ease-out"
      enterFrom="transform -translate-y-4 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform -translate-y-4 opacity-0"
      show={show}
    >
      {children}
    </Transition>
  );
};

export default SlideDownFade;

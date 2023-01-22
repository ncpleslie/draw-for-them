import { useState } from "react";
import ButtonBarBtn from "../../models/button-bar-btn.model";
import Btn from "./Btn";

interface ButtonBarProps {
  className?: string;
  buttons: ButtonBarBtn[];
}

const ButtonBar: React.FC<ButtonBarProps> = ({ className, buttons }) => {
  const [isClicked, setIsClicked] = useState(false);
  const handleBtnClicked = (index: number) => {
    if (!buttons) {
      return;
    }

    buttons[index]?.onClick();

    if (buttons[index]?.nestedButtons) {
      setIsClicked((prev) => !prev);
    }
  };

  return (
    <div className={`${className} wrap flex flex-row justify-center gap-2`}>
      {buttons.map((btn, i) => {
        return (
          <div key={i} className={"flex flex-col gap-4"}>
            <Btn
              onClicked={() => handleBtnClicked(i)}
              style={btn.style}
              className={btn.className}
            >
              {btn.icon}
            </Btn>
            {btn.nestedButtons &&
              btn.nestedButtons.map((nestedBtn, i) => (
                <Btn
                  onClicked={nestedBtn.onClick}
                  style={nestedBtn.style}
                  className={`${nestedBtn.className}  ${
                    isClicked ? "z-10 opacity-100" : "opacity-0"
                  } duration-${[i * 300]} transition ease-in-out`}
                  key={i}
                >
                  {nestedBtn.icon}
                </Btn>
              ))}
          </div>
        );
      })}
    </div>
  );
};

export default ButtonBar;

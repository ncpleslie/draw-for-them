import { useState } from "react";
import ButtonBarBtn from "../../models/button-bar-btn";
import Btn from "./Btn";

interface ButtonBarProps {
  className?: string;
  buttons: ButtonBarBtn[];
}

const ButtonBar: React.FC<ButtonBarProps> = ({ className, buttons }) => {
  const [isClicked, setIsClicked] = useState(false);
  const handleBtnClicked = (index: number) => {
    buttons[index].onClick();

    if (buttons[index].nestedButtons) {
      setIsClicked((prev) => !prev);
    }
  };

  return (
    <div className={`${className} flex flex-row gap-4 justify-center`}>
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
                    isClicked ? "opacity-100 z-10" : "opacity-0"
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

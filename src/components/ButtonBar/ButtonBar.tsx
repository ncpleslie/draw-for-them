import ButtonBarBtn from "../../models/button-bar-btn";
import Btn from "../UI/Btn";

interface ButtonBarProps {
  className?: string;
  buttons: ButtonBarBtn[];
}

const ButtonBar: React.FC<ButtonBarProps> = ({ className, buttons }) => {
  return (
    <div className={`${className} flex flex-row gap-4 justify-center`}>
      {buttons.map((btn, i) => {
        return (
          <Btn onClicked={btn.onClick} className={btn.className} key={i}>
            {btn.icon}
          </Btn>
        );
      })}
    </div>
  );
};

export default ButtonBar;

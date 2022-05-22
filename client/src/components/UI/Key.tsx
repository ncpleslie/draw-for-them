import { FC, memo } from "react";
import { KeyboardSpecialKey } from "../../enums/keyboard-special-key.enum";
import Icon from "./Icon";

interface KeyProps {
  character: string;
  onKeyClicked: (character: string) => void;
}

const Key: FC<KeyProps> = memo((props) => {
  const handleOnClick = (): void => {
    props.onKeyClicked(props.character);
  };

  return (
    <button
      className="inline-block h-fit w-8 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500"
      onClick={handleOnClick}
    >
      <p className="py-5 px-[10px] text-xs font-bold">
        {props.character === KeyboardSpecialKey.Delete && <Icon.Delete />}
        {props.character === KeyboardSpecialKey.Modifier && <Icon.AngleUp />}
        {props.character !== KeyboardSpecialKey.Delete &&
          props.character !== KeyboardSpecialKey.Modifier &&
          props.character.toUpperCase()}
      </p>
    </button>
  );
});

export default Key;

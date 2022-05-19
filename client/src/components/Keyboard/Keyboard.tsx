import { Fragment } from "react";
import Key from "../UI/Key";

interface KeyboardProps {
  onKeyEntered: (key: string) => void;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyEntered }) => {
  const keyboardLayout = [
    { character: "Q", order: 0, row: 0 },
    { character: "W", order: 1, row: 0 },
    { character: "E", order: 2, row: 0 },
    { character: "R", order: 3, row: 0 },
    { character: "T", order: 4, row: 0 },
    { character: "Y", order: 5, row: 0 },
    { character: "U", order: 6, row: 0 },
    { character: "I", order: 7, row: 0 },
    { character: "O", order: 8, row: 0 },
    { character: "P", order: 9, row: 0 },
    { character: "A", order: 0, row: 1 },
    { character: "S", order: 1, row: 1 },
    { character: "D", order: 2, row: 1 },
    { character: "F", order: 3, row: 1 },
    { character: "G", order: 4, row: 1 },
    { character: "H", order: 5, row: 1 },
    { character: "J", order: 6, row: 1 },
    { character: "K", order: 7, row: 1 },
    { character: "L", order: 8, row: 1 },
    { character: "Z", order: 1, row: 2 },
    { character: "X", order: 2, row: 2 },
    { character: "C", order: 3, row: 2 },
    { character: "V", order: 4, row: 2 },
    { character: "B", order: 5, row: 2 },
    { character: "N", order: 6, row: 2 },
    { character: "M", order: 7, row: 2 },
    { character: "<", order: 8, row: 2 },
  ];

  const handleOnKeyboardKeyClick = async (key: string): Promise<void> => {
    onKeyEntered(key);
  };

  let keyboardRowNumber = 0;

  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-1">
      {keyboardLayout.map((aKey: any, index: number) => {
        const key = (
          <Key
            key={aKey.character}
            character={aKey.character}
            onKeyClicked={handleOnKeyboardKeyClick}
          />
        );

        if (keyboardLayout[index].row !== keyboardRowNumber) {
          keyboardRowNumber = keyboardLayout[index].row;

          return (
            <Fragment key={aKey.character}>
              <div className="w-full basis-full"></div>
              {key}
            </Fragment>
          );
        }

        return key;
      })}
    </div>
  );
};

export default Keyboard;

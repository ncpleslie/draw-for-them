import { Fragment, useState } from "react";
import { KeyboardSpecialKey } from "../../enums/keyboard-special-key.enum";
import Key from "../UI/Key";

interface KeyboardProps {
  onKeyEntered: (key: string) => void;
}

interface KeyType {
  character: string;
  order: number;
  row: number;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyEntered }) => {
  const [showExpanded, setShowExpanded] = useState(false);

  const keyboardLayout: KeyType[] = [
    { character: "!", order: 0, row: 0 },
    { character: "@", order: 1, row: 0 },
    { character: "#", order: 2, row: 0 },
    { character: "$", order: 3, row: 0 },
    { character: "%", order: 4, row: 0 },
    { character: "^", order: 5, row: 0 },
    { character: "&", order: 6, row: 0 },
    { character: "*", order: 7, row: 0 },
    { character: "(", order: 8, row: 0 },
    { character: ")", order: 9, row: 0 },
    { character: "_", order: 10, row: 0 },
    { character: "1", order: 0, row: 1 },
    { character: "2", order: 1, row: 1 },
    { character: "3", order: 2, row: 1 },
    { character: "4", order: 3, row: 1 },
    { character: "5", order: 4, row: 1 },
    { character: "6", order: 5, row: 1 },
    { character: "7", order: 6, row: 1 },
    { character: "8", order: 7, row: 1 },
    { character: "9", order: 8, row: 1 },
    { character: "0", order: 9, row: 1 },
    { character: "-", order: 10, row: 1 },
    { character: "Q", order: 0, row: 2 },
    { character: "W", order: 1, row: 2 },
    { character: "E", order: 2, row: 2 },
    { character: "R", order: 3, row: 2 },
    { character: "T", order: 4, row: 2 },
    { character: "Y", order: 5, row: 2 },
    { character: "U", order: 6, row: 2 },
    { character: "I", order: 7, row: 2 },
    { character: "O", order: 8, row: 2 },
    { character: "P", order: 9, row: 2 },
    { character: "A", order: 0, row: 3 },
    { character: "S", order: 1, row: 3 },
    { character: "D", order: 2, row: 3 },
    { character: "F", order: 3, row: 3 },
    { character: "G", order: 4, row: 3 },
    { character: "H", order: 5, row: 3 },
    { character: "J", order: 6, row: 3 },
    { character: "K", order: 7, row: 3 },
    { character: "L", order: 8, row: 3 },
    { character: KeyboardSpecialKey.Modifier, order: 0, row: 4 },
    { character: "Z", order: 1, row: 4 },
    { character: "X", order: 2, row: 4 },
    { character: "C", order: 3, row: 4 },
    { character: "V", order: 4, row: 4 },
    { character: "B", order: 5, row: 4 },
    { character: "N", order: 6, row: 4 },
    { character: "M", order: 7, row: 4 },
    { character: ".", order: 8, row: 4 },
    { character: KeyboardSpecialKey.Delete, order: 9, row: 4 },
  ];

  const handleOnKeyboardKeyClick = async (key: string): Promise<void> => {
    if (key === KeyboardSpecialKey.Modifier) {
      setShowExpanded((prev) => !prev);

      return;
    }

    onKeyEntered(key);
  };

  let keyboardRowNumber = 0;

  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-1">
      {keyboardLayout.map((aKey: KeyType, index: number) => {
        if (aKey.row === 0 && !showExpanded) {
          return;
        }

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

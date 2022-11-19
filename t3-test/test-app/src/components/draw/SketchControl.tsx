import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import ButtonBarBtn from "../../models/button-bar-btn.model";
import ButtonBar from "../ui/ButtonBar";
import Icon from "../ui/Icon";

interface SketchControlProps {
  isDrawMode: boolean;
  selectedColor: string;
  onPenClicked: () => void;
  onCircleClicked: () => void;
  onSquareClicked: () => void;
  onUndoClicked: () => void;
  onTrashClicked: () => void;
  onSaveClicked: () => void;
  onColorPicked: (color: string) => void;
  className?: string;
}

const SketchControl: React.FC<SketchControlProps> = (props) => {
  const [color, setColor] = useState(props.selectedColor);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleOnColorPicked = (color: string) => {
    setColor(color);
    props.onColorPicked(color);
  };

  const handleOnColorClicked = () => {
    setShowColorPicker((prev) => !prev);
  };

  const btnBar: ButtonBarBtn[] = [
    new ButtonBarBtn(
      <Icon.Pen />,
      props.onPenClicked,
      `${props.isDrawMode && "!text-[#15e38a]"}`
    ),

    new ButtonBarBtn(<Icon.Color />, handleOnColorClicked, undefined, {
      color: color,
    }),

    // Removed for now until it is easier to use on smaller screens.
    // new ButtonBarBtn(<Icon.Shapes />, () => {}, undefined, undefined, [
    //   new ButtonBarBtn(<Icon.Circle />, props.onCircleClicked),
    //   new ButtonBarBtn(<Icon.Square />, props.onSquareClicked),
    // ]),

    new ButtonBarBtn(<Icon.Undo />, props.onUndoClicked),
    new ButtonBarBtn(<Icon.Trash />, props.onTrashClicked, "!text-red-700"),
    new ButtonBarBtn(<Icon.Save />, props.onSaveClicked),
  ];

  return (
    <>
      <ButtonBar buttons={btnBar} className={props.className} />
      <div className="absolute bottom-20">
        {showColorPicker && (
          <HexColorPicker
            className="z-20"
            color={color}
            onChange={handleOnColorPicked}
          />
        )}
      </div>
    </>
  );
};

export default SketchControl;

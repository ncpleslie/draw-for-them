import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import ButtonBarBtn from "../../models/button-bar-btn";
import ButtonBar from "../ButtonBar/ButtonBar";
import Icon from "../UI/Icon";

const SketchArea: React.FC = () => {
  const { editor, onReady } = useFabricJSEditor();
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [color, setColor] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const history = [];

  const handleOnUndoClicked = () => {
    if (editor?.canvas._objects.length > 0) {
      history.push(editor?.canvas._objects.pop());
      editor?.canvas.renderAll();
    }
  };

  const handleOnCircleClicked = () => {
    editor?.addCircle();
  };

  const handleOnSquareClicked = () => {
    editor?.addRectangle();
  };

  const handleOnColorPicked = (color: string) => {
    setColor(color);
    const canvas = editor?.canvas;
    canvas.freeDrawingBrush.color = color;
  };

  const handleOnPenClicked = () => {
    const canvas = editor?.canvas;
    canvas.isDrawingMode = !canvas.isDrawingMode;
    setIsDrawMode(canvas.isDrawingMode);
  };

  const handleOnTrashClicked = () => {
    editor?.canvas.remove(...editor?.canvas.getObjects());
  };

  const handleOnColorClicked = () => {
    setShowColorPicker((prev) => !prev);
  };

  const handleOnSave = () => {
    console.log(
      editor?.canvas.toDataURL({
        width: editor?.canvas.width,
        height: editor?.canvas.height,
        left: 0,
        top: 0,
        format: "png",
      })
    );
  };

  const btnBar: ButtonBarBtn[] = [
    new ButtonBarBtn(
      <Icon.Pen />,
      handleOnPenClicked,
      isDrawMode ? "bg-blue-700" : ""
    ),

    new ButtonBarBtn(<Icon.Color />, handleOnColorClicked, undefined, {
      backgroundColor: color,
    }),

    new ButtonBarBtn(<Icon.Shapes />, () => {}, undefined, undefined, [
      new ButtonBarBtn(<Icon.Circle />, handleOnCircleClicked),
      new ButtonBarBtn(<Icon.Square />, handleOnSquareClicked),
    ]),

    new ButtonBarBtn(<Icon.Undo />, handleOnUndoClicked),
    new ButtonBarBtn(<Icon.Trash />, handleOnTrashClicked, "bg-red-700"),
    new ButtonBarBtn(<Icon.Save />, handleOnSave),
  ];

  return (
    <div className="flex flex-col justify-center items-center">
      <ButtonBar buttons={btnBar} className={"my-4 absolute top-0"} />
      <div className="absolute top-20">
        {showColorPicker && (
          <HexColorPicker
            className="z-20"
            color={color}
            onChange={handleOnColorPicked}
          />
        )}
      </div>
      <FabricJSCanvas
        className={"w-[90vw] h-[90vh] mt-[80px] border"}
        onReady={onReady}
      />
    </div>
  );
};

export default SketchArea;

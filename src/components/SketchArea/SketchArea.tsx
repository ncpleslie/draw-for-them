import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { useState } from "react";
import ButtonBarBtn from "../../models/button-bar-btn";
import ButtonBar from "../ButtonBar/ButtonBar";
import Icon from "../UI/Icon";

const SketchArea: React.FC = () => {
  const { editor, onReady } = useFabricJSEditor();
  const [isDrawMode, setIsDrawMode] = useState(false);
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

  const handleOnPenClicked = () => {
    const canvas = editor?.canvas;
    canvas.isDrawingMode = !canvas.isDrawingMode;
    setIsDrawMode(canvas.isDrawingMode);
  };

  const handleOnTrashClicked = () => {
    editor?.canvas.remove(...editor?.canvas.getObjects());
  };

  const btnBar: ButtonBarBtn[] = [
    new ButtonBarBtn(
      <Icon.Pen />,
      handleOnPenClicked,
      `${isDrawMode && "bg-blue-700"}`
    ),
    new ButtonBarBtn(<Icon.Circle />, handleOnCircleClicked),
    new ButtonBarBtn(<Icon.Square />, handleOnSquareClicked),
    new ButtonBarBtn(<Icon.Undo />, handleOnUndoClicked),
    new ButtonBarBtn(<Icon.Trash />, handleOnTrashClicked, "bg-red-700"),
  ];

  return (
    <div className="flex flex-col justify-center items-center">
      <ButtonBar buttons={btnBar} className={"my-4"} />

      <FabricJSCanvas
        className={"w-[90vw] h-[90vh] border"}
        onReady={onReady}
      />
    </div>
  );
};

export default SketchArea;

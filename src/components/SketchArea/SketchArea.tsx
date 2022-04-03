import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { useEffect } from "react";

interface SketchAreaProps {
  undo: boolean;
  save: boolean;
  trash: boolean;
  shape: ShapeProps;
  isDrawMode: boolean;
  selectedColor: string;
  className?: string;
}

interface ShapeProps {
  circle: boolean;
  square: boolean;
}

const SketchArea: React.FC<SketchAreaProps> = (props) => {
  const { editor, onReady } = useFabricJSEditor();
  const history = [];

  useEffect(() => {
    const canvas = editor?.canvas;

    if (!canvas) {
      return;
    }

    canvas.isDrawingMode = props.isDrawMode;
  }, [props.isDrawMode]);

  useEffect(() => {
    const canvas = editor?.canvas;

    if (!canvas) {
      return;
    }

    canvas.freeDrawingBrush.color = props.selectedColor;
  }, [props.selectedColor]);

  useEffect(() => {
    const canvas = editor?.canvas;

    if (!canvas) {
      return;
    }

    if (editor?.canvas._objects.length > 0) {
      history.push(editor?.canvas._objects.pop());
      editor?.canvas.renderAll();
    }
  }, [props.undo]);

  useEffect(() => {
    const canvas = editor?.canvas;

    if (!canvas) {
      return;
    }

    console.log(
      editor?.canvas.toDataURL({
        width: editor?.canvas.width,
        height: editor?.canvas.height,
        left: 0,
        top: 0,
        format: "png",
      })
    );
  }, [props.save]);

  useEffect(() => {
    const canvas = editor?.canvas;

    if (!canvas) {
      return;
    }

    editor?.canvas.remove(...editor?.canvas.getObjects());
  }, [props.trash]);

  useEffect(() => {
    editor?.addCircle();
  }, [props.shape.circle]);

  useEffect(() => {
    editor?.addRectangle();
  }, [props.shape.square]);

  return (
    <FabricJSCanvas className={`${props.className} border`} onReady={onReady} />
  );
};

export default SketchArea;

import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import React from "react";
import { useEffect } from "react";

interface SketchAreaProps {
  undo: boolean;
  save: boolean;
  trash: boolean;
  shape: ShapeProps;
  isDrawMode: boolean;
  selectedColor: string;
  className?: string;
  onSave: (imageData: string) => void;
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
  }, [props.isDrawMode, editor?.canvas]);

  useEffect(() => {
    const canvas = editor?.canvas;

    if (!canvas) {
      return;
    }

    canvas.freeDrawingBrush.color = props.selectedColor;
  }, [props.selectedColor, editor?.canvas]);

  useEffect(() => {
    const canvas = editor?.canvas;

    if (!canvas) {
      return;
    }

    if (editor?.canvas._objects.length > 0) {
      history.push(editor?.canvas._objects.pop());
      editor?.canvas.renderAll();
    }
  }, [props.undo, editor?.canvas]);

  useEffect(() => {
    if (!props.save) {
      return;
    }

    const canvas = editor?.canvas;

    if (!canvas) {
      return;
    }

    const canvasImageData = editor?.canvas.toDataURL("image/png", {
      width: editor?.canvas.width,
      height: editor?.canvas.height,
      left: 0,
      top: 0,
      format: "png",
    });

    props.onSave(canvasImageData);
  }, [props.save, editor?.canvas]);

  useEffect(() => {
    const canvas = editor?.canvas;

    if (!canvas) {
      return;
    }

    editor?.canvas.remove(...editor?.canvas.getObjects());
  }, [props.trash, editor?.canvas]);

  useEffect(() => {
    editor?.addCircle();
  }, [props.shape.circle]);

  useEffect(() => {
    editor?.addRectangle();
  }, [props.shape.square]);

  return (
    <FabricJSCanvas
      className={`${props.className} neu-container rounded-xl border`}
      onReady={onReady}
    />
  );
};

export default SketchArea;

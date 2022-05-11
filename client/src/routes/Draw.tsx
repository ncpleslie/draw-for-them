import axios from "axios";
import { useEffect, useState } from "react";
import Api from "../api/api";
import Header from "../components/Header/Header";
import SketchArea from "../components/SketchArea/SketchArea";
import SketchControl from "../components/SketchControl/SketchControl";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import ErrorNotification from "../models/error-notification.model";
import SuccessNotification from "../models/success-notification.model";
import { store } from "../store/store";

export default function Draw() {
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [undo, setUndo] = useState(false);
  const [shape, setShape] = useState({ circle: false, square: false });
  const [trash, setTrash] = useState(false);
  const [save, setSave] = useState(false);
  const [loading, setLoading] = useState<boolean>();

  const handleOnUndoClicked = () => setUndo((prev) => !prev);

  const handleOnCircleClicked = () =>
    setShape((prev) => ({
      circle: !prev.circle,
      square: prev.square,
    }));

  const handleOnSquareClicked = () =>
    setShape((prev) => ({
      circle: prev.circle,
      square: !prev.square,
    }));

  const handleOnColorPicked = (color: string) => setSelectedColor(color);

  const handleOnPenClicked = () => setIsDrawMode((prev) => !prev);

  const handleOnTrashClicked = () => setTrash((prev) => !prev);

  const handleOnSaveClicked = () => setSave((prev) => !prev);

  const handleOnSave = async (imageData: string): Promise<void> => {
    setLoading(true);
    try {
      await Api.postImage(imageData);
      store.notifications.push(
        new SuccessNotification("That masterpiece was sent!")
      );
      handleOnTrashClicked();
      setLoading(false);
    } catch (e) {
      store.notifications.push(
        new ErrorNotification(
          "Oops! Something went wrong. Please try send that masterpiece again."
        )
      );
    }
  };

  const sketchControlProps = {
    isDrawMode,
    selectedColor,
    onPenClicked: handleOnPenClicked,
    onCircleClicked: handleOnCircleClicked,
    onSquareClicked: handleOnSquareClicked,
    onUndoClicked: handleOnUndoClicked,
    onTrashClicked: handleOnTrashClicked,
    onSaveClicked: handleOnSaveClicked,
    onColorPicked: handleOnColorPicked,
  };

  const sketchAreaProps = {
    isDrawMode,
    selectedColor,
    undo,
    shape,
    trash,
    save,
    onSave: handleOnSave,
  };

  return (
    <div className="h-[100vh] app-container overflow-hidden">
      <Header />

      <div className="flex flex-col justify-center items-center p-4">
        <SketchControl
          {...sketchControlProps}
          className="my-4 absolute top-0"
        />
        {loading && (
          <div className="absolute">
            <LoadingIndicator />
          </div>
        )}
        <SketchArea {...sketchAreaProps} className="h-[90vh] w-[90vw]" />
      </div>
    </div>
  );
}

import { useState } from "react";
import Header from "../components/Header/Header";
import SketchArea from "../components/SketchArea/SketchArea";
import SketchControl from "../components/SketchControl/SketchControl";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import ToastService from "../services/toast.service";
import UserEventService from "../services/user-event.service";
import UserService from "../services/user.service";

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
      const userDetail = await UserService.getCurrentUserDetail();

      if (userDetail.friendIds.length === 1) {
        await UserEventService.sendDrawEvent(
          userDetail.friendIds[0],
          imageData
        );
      }

      ToastService.showSuccessToast("That masterpiece was sent!");
      handleOnTrashClicked();
      setLoading(false);
    } catch (e) {
      setLoading(false);
      ToastService.showErrorToast(
        "Oops! Something went wrong. Please try send that masterpiece again."
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
          <div className="absolute z-10">
            <LoadingIndicator />
          </div>
        )}
        <SketchArea {...sketchAreaProps} className="h-[75vh] w-[90vw]" />
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const userDetail = await UserService.getCurrentUserDetail();

        console.log(userDetail);

        if (userDetail.friendIds.length === 0) {
          ToastService.showErrorToast(
            "You have no friends. How about making some before you draw something"
          );
          navigate({ pathname: "/add_friends" });
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
      console.error(e);
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
    <div className="app-container h-[100vh] overflow-hidden">
      <Header />

      <div className="flex flex-col items-center justify-center p-4">
        <SketchControl
          {...sketchControlProps}
          className="absolute top-0 my-4"
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

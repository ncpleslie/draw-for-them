import SketchArea from "./SketchArea";
import SketchControl from "./SketchControl";
import LoadingIndicator from "../ui/LoadingIndicator";
import { useEffect, useRef, useState } from "react";

const DrawingArea: React.FC = () => {
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
      //   const userDetail = await UserService.getCurrentUserDetail();

      //   if (userDetail.friendIds.length === 1) {
      //     await UserEventService.sendDrawEvent(
      //       userDetail.friendIds[0],
      //       imageData
      //     );
      //   }

      alert("That masterpiece was sent!");
      handleOnTrashClicked();
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
      alert(
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

  const containerRef = useRef(null);
  const [drawAreaHeight, setDrawAreaHeight] = useState(0);

  const observer = useRef(
    new ResizeObserver((entries) => {
      if (!entries) {
        return;
      }

      if (entries.length === 0) {
        return;
      }

      const margin = 150;
      setDrawAreaHeight(entries[0]!.contentRect.height - margin);
    })
  );

  useEffect(() => {
    if (containerRef.current) {
      observer.current.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.current.unobserve(containerRef.current);
      }
    };
  }, [containerRef]);

  return (
    <div
      className="flex h-full flex-col items-center justify-start p-4"
      ref={containerRef}
    >
      {loading && (
        <div className="absolute z-10 flex h-[100vh] w-[100vw] items-center justify-center">
          <LoadingIndicator />
        </div>
      )}
      <div style={{ height: `${drawAreaHeight}px` }}>
        {drawAreaHeight !== 0 && (
          <SketchArea {...sketchAreaProps} className={`h-full w-[90vw]`} />
        )}
      </div>
      <SketchControl
        {...sketchControlProps}
        className="absolute bottom-0 my-4 h-12"
      />
    </div>
  );
};

export default DrawingArea;

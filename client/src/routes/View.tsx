import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { store } from "../store/store";
import Api from "../api/api";
import Header from "../components/Header/Header";
import LoadingIndicator from "../components/UI/LoadingIndicator";

export default function View() {
  const { activeDrawEvents } = useSnapshot(store);
  const [loading, setLoading] = useState<boolean>();
  const [image, setImage] = useState<string>();

  useEffect(() => {
    if (!(activeDrawEvents.length > 0)) {
      setLoading(true);

      return;
    }

    handleOnLoad(activeDrawEvents[0].imageId);
  }, [activeDrawEvents]);

  const handleOnLoad = async (imageName: string): Promise<void> => {
    setLoading(true);

    try {
      const response = await Api.getImageByName(imageName);
      setImage(response);
    } catch (e) {
      console.error("Failed to download image", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100vh] app-container overflow-hidden">
      <Header />
      <div className="flex flex-col justify-center items-center">
        {loading && (
          <div className="absolute">
            <LoadingIndicator />
          </div>
        )}
        <img
          className="neu-container rounded-xl h-[90vh] w-[90vw]"
          src={image}
        />
      </div>
    </div>
  );
}

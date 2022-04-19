import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { store } from "../store/store";
import Api from "../api/api";

export default function View() {
  const { drawEvents } = useSnapshot(store);
  const [loading, setLoading] = useState<boolean>();
  const [image, setImage] = useState<string>();

  useEffect(() => {
    if (!(drawEvents.length > 0)) {
      return;
    }

    handleOnLoad(drawEvents[1].imageId);
  }, [drawEvents]);

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

  if (loading || !image) {
    return <>Loading...</>;
  }

  return (
    <>
      <img src={image} />
    </>
  );
}

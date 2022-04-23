import { useEffect, useState } from "react";
import Api from "../api/api";
import Header from "../components/Header/Header";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function View() {
  const [loading, setLoading] = useState<boolean>();
  const [image, setImage] = useState<string>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      navigate({ pathname: "/" });
    }

    if (imageId) {
      handleOnLoad(imageId);
    }
  }, []);

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

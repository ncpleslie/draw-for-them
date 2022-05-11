import { useEffect, useState } from "react";
import Api from "../api/api";
import Header from "../components/Header/Header";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ErrorNotification from "../models/error-notification.model";
import { store } from "../store/store";

export default function View() {
  const [loading, setLoading] = useState<boolean>();
  const [image, setImage] = useState<string>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Listen to changes to the url
  useEffect(() => {
    handleOnLoad();
  }, [location]);

  const handleOnLoad = async (): Promise<void> => {
    setLoading(true);

    const imageId = searchParams.get("imageId");

    if (!imageId) {
      navigate({ pathname: "/" });

      return;
    }

    try {
      const response = await Api.getImageById(imageId);
      setImage(response);
    } catch (e) {
      store.notifications.push(
        new ErrorNotification(
          "Oops! Something went wrong while trying to view that masterpiece"
        )
      );
      navigate({ pathname: "/" });
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

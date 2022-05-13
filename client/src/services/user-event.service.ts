import {
  getFirestore,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore";
import Api from "../api/api";
import { app } from "../api/firebase.config";
import AppConstant from "../constants/app.constant";
import DrawEvent from "../models/responses/draw_event.model";
import { store } from "../store/store";
import ToastService from "./toast.service";

export default class UserEventService {
  private static firestore = getFirestore(app);

  public static async start(): Promise<void> {
    if (!store.user) {
      return;
    }

    const userId = store.user.uid;

    try {
      const drawEventDocData = query(
        collection(
          UserEventService.firestore,
          AppConstant.eventsCollectionName,
          userId,
          "draw_events"
        ),
        where("active", "==", true)
      );

      onSnapshot(drawEventDocData, async (querySnapshot) => {
        const newEvents = querySnapshot.docs.map(
          (d) => new DrawEvent(d.data())
        );
        if (newEvents.length === 0) {
          store.drawEvents = [];

          return;
        }

        // Determine how many events are new, different events.
        const diffEvents = newEvents.filter(
          (newEvent) =>
            !store.drawEvents.some(
              (currEvent) => currEvent.imageId === newEvent.imageId
            )
        );

        if (diffEvents.length > 0) {
          ToastService.showSuccessToast("You have a new drawing!");
        }

        store.drawEvents = newEvents;
      });
    } catch {
      ToastService.showErrorToast("Oops! Something went wrong");
    }
  }

  public static async sendDrawEvent(imageData: string): Promise<void> {
    // TODO: Trigger user selection dialog here
    await Api.postImage(store.user?.uid!, imageData);
  }

  public static async getDrawEvent(imageId: string): Promise<string> {
    return await Api.getImageById(imageId);
  }
}

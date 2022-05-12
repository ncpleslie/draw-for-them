import {
  getFirestore,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore";
import { app } from "../api/firebase.config";
import AppConstant from "../constants/app.constant";
import DrawEvent from "../models/responses/draw_event.model";
import { store } from "../store/store";
import ToastService from "./toast.service";

export default class UserEventService {
  private static firestore = getFirestore(app);

  public static async start(): Promise<void> {
    try {
      const drawEventDocData = query(
        collection(
          UserEventService.firestore,
          AppConstant.eventsCollectionName,
          "user_1",
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
          ToastService.showSuccessToast("You have a new drawing");
        }

        store.drawEvents = newEvents;
      });
    } catch {
      ToastService.showErrorToast("Oops! Something went wrong");
    }
  }
}

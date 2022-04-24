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

export default class UserEventService {
  private static firestore = getFirestore(app);

  public static async start(): Promise<void> {
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
      store.drawEvents = querySnapshot.docs.map((d) => new DrawEvent(d.data()));
    });
  }
}

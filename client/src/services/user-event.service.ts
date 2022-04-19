import { getFirestore, doc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { app } from "../api/firebase.config";
import AppConstant from "../constants/app.constant";
import UserEvent from "../models/responses/user_event.model";
import { store } from "../store/store";

export default class UserEventService {
  private static firestore = getFirestore(app);

  public static start(): void {
    onSnapshot(
      doc(
        UserEventService.firestore,
        AppConstant.eventsCollectionName,
        "user_1"
      ),
      (doc) => {
        const docData = doc.data();
        if (!docData) {
          return;
        }

        const userEvent = new UserEvent(docData);
        store.drawEvents = userEvent.drawEvents;
        store.activeDrawEvents = userEvent.drawEvents.filter((d) => d.active);
      }
    );
  }
}

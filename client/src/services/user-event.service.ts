import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { app } from "../api/firebase.config";
import AppConstant from "../constants/app.constant";
import User from "../models/responses/user.model";
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
      (snapshot) => {
        const docData = snapshot.data();
        if (!docData) {
          return;
        }

        const userEvent = new UserEvent(docData);

        // set createdBy to a readable username
        userEvent.drawEvents.forEach(async (drawEvent) => {
          onSnapshot(
            doc(
              UserEventService.firestore,
              AppConstant.usersCollectionName,
              drawEvent.createdBy
            ),
            (snapshot) => {
              const docData = snapshot.data();
              if (!docData) {
                return;
              }
              const user = new User(docData);
              drawEvent.createdBy = user.name;

              store.drawEvents.push(drawEvent);

              if (drawEvent.active) {
                store.activeDrawEvents.push(drawEvent);
              }
            }
          );
        });
      }
    );
  }
}

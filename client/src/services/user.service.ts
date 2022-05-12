import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { store } from "../store/store";
import { app } from "../api/firebase.config";

export default class UserService {
  public static async getAndPersistCurrentUser(): Promise<void> {
    app;
    const auth = getAuth();

    await new Promise((resolve, reject) =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(user);
          store.user = user;
        } else {
          reject("No user logged in");
          store.user = null;
        }
      })
    );
  }

  public static listenToAuthChange(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        store.user = user;
      } else {
        store.user = null;
      }
    });
  }

  public static signOut(): void {
    const auth = getAuth();
    signOut(auth);
  }
}

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { store } from "../store/store";

export default class UserService {
  public static listenToAuthChange(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        store.user = user;
        // ...
      } else {
        console.log("user logged out");
        store.user = null;
      }
    });
  }

  public static signOut(): void {
    const auth = getAuth();
    signOut(auth);
  }
}

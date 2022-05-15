import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { store } from "../store/store";
import { app } from "../api/firebase.config";
import Api from "../api/api";
import history from "../components/CustomRouter/history";
import UserDetail from "../models/user-detail.model";

export default class UserService {
  public static async getAndPersistCurrentUser(): Promise<void> {
    app;
    const auth = getAuth();

    const user = await new Promise<User>((resolve, reject) =>
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

    const userDetail = await Api.getUserById(user.uid);

    if (userDetail.friendIds.length === 0) {
      history.replace("/add_friends");
    }
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

  public static async searchUserByDisplayName(
    displayName: string
  ): Promise<UserDetail> {
    const searchedUserDetail = await Api.searchUser(displayName);

    return searchedUserDetail;
  }

  public static async addAFriend(userId: string): Promise<void> {
    await Api.addAFriend(userId);
  }
}

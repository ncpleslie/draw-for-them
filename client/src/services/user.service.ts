import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { store } from "../store/store";
import { app } from "../api/firebase.config";
import Api from "../api/api";
import UserDetail from "../models/user-detail.model";

export default class UserService {
  public static async getAndPersistCurrentUser(): Promise<void> {
    app;
    const auth = getAuth();

    await new Promise<User>((resolve, reject) =>
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

  public static async getCurrentUserDetail(): Promise<UserDetail> {
    const user = store.user;
    if (!user) {
      throw new Error("User not found");
    }

    return await Api.getUserById(user.uid);
  }

  public static listenToAuthChange(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      store.user = user;
    });
  }

  public static async login(email: string, password: string): Promise<void> {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
  }

  public static async signUp(
    displayName: string,
    email: string,
    password: string
  ): Promise<void> {
    const auth = getAuth();
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: displayName });
  }

  public static async signOut(): Promise<void> {
    const auth = getAuth();
    await signOut(auth);
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

import { auth } from "firebase-admin";
import { UserRecord } from "firebase-functions/v1/auth";
import Database from "../domain/database";
const database = new Database();

export const addNewUserAsync = async (user: UserRecord): Promise<void> => {
  // Obtain the user record from firebase.
  // This is to ensure the displayName property is always present.
  const authUser = await auth().getUser(user.uid);
  await database.createUserAsync(authUser);
};

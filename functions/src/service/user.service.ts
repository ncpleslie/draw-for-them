import { auth } from "firebase-admin";
import { UserRecord } from "firebase-functions/v1/auth";
import Database from "../domain/database";
import User from "../models/user";
const database = new Database();

export const addNewUserAsync = async (user: UserRecord): Promise<void> => {
  // Obtain the user record from firebase.
  // This is to ensure the displayName property is always present.
  const authUser = await auth().getUser(user.uid);
  await database.createUserAsync(authUser);
};

export const getUserByIdAsync = async (userId: string): Promise<User> => {
  const authUser = await auth().getUser(userId);
  return await database.getUserAsync(authUser);
};

export const getUserByDisplayNameAsync = async (
  displayName: string
): Promise<User> => {
  return await database.getUserByDisplayNameAsync(displayName);
};

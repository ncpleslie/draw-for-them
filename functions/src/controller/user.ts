import * as functions from "firebase-functions";
import { UserRecord } from "firebase-functions/v1/auth";
import { addNewUserAsync } from "../service/user.service";

export const addNewUser = async (user: UserRecord) => {
  functions.logger.log("A new user has been created", user);

  await addNewUserAsync(user);
};

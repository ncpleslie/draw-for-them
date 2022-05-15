import { auth } from "firebase-admin";
import { v4 as uuid } from "uuid";
import Database from "../domain/database";
import Storage from "../domain/storage";
import { app } from "./admin";
const storage = new Storage(app);
const database = new Database();

export const getImageByIdAsync = async (
  userToken: string,
  imageId: string
): Promise<Buffer> => {
  const decodedToken = await auth().verifyIdToken(userToken);
  const currentUser = await auth().getUser(decodedToken.uid);

  const drawEvent = await database.getDrawEventAsync(currentUser.uid, imageId);

  if (!drawEvent.active) {
    throw new Error(`Draw event of id: ${imageId} is not active`);
  }

  const filename = `${currentUser.uid}/${imageId}`;
  const imageBuffer = await storage.getImageByNameAsync(filename);

  drawEvent.active = false;
  await database.updateDrawEventAsync(currentUser.uid, drawEvent);

  return imageBuffer;
};

export const addDrawEventAsync = async (
  userToken: string,
  receiverId: string,
  imageData: string
): Promise<void> => {
  const decodedToken = await auth().verifyIdToken(userToken);
  const currentUser = await auth().getUser(decodedToken.uid);

  const imageAsBase64 = imageData.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(imageAsBase64, "base64");
  const imageByteArray = new Uint8Array(imageBuffer);
  const imageId = uuid();
  const filename = `${receiverId}/${imageId}`;
  await storage.uploadImageAsync(imageByteArray, filename);
  await database.createDrawEventAsync(receiverId, imageId, currentUser.uid);
};

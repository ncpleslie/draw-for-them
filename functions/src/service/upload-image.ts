import { v4 as uuid } from "uuid";
import { app } from "./admin";
import Storage from "../domain/storage";
import Database from "../domain/database";
const storage = new Storage(app);
const database = new Database();

export const addDrawEventAsync = async (
  receiverId: string,
  imageData: string
): Promise<void> => {
  const imageAsBase64 = imageData.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(imageAsBase64, "base64");
  const imageByteArray = new Uint8Array(imageBuffer);
  const filename = uuid();
  await storage.uploadImageAsync(imageByteArray, filename);
  await database.createDrawEventAsync(receiverId, filename);
};

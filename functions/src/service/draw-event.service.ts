import { v4 as uuid } from "uuid";
import Database from "../domain/database";
import Storage from "../domain/storage";
import { app } from "./admin";
const storage = new Storage(app);
const database = new Database();

export const getImageByIdAsync = async (imageId: string): Promise<Buffer> => {
  const userId = "user_1";
  const drawEvent = await database.getDrawEventAsync(userId, imageId);

  if (!drawEvent.active) {
    throw new Error(`Draw event of id: ${imageId} is not active`);
  }

  const filename = `${userId}/${imageId}`;
  const imageBuffer = await storage.getImageByNameAsync(filename);

  drawEvent.active = false;
  await database.updateDrawEventAsync("user_1", drawEvent);

  return imageBuffer;
};

export const addDrawEventAsync = async (
  receiverId: string,
  imageData: string
): Promise<void> => {
  const imageAsBase64 = imageData.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(imageAsBase64, "base64");
  const imageByteArray = new Uint8Array(imageBuffer);
  const imageId = uuid();
  const filename = `${receiverId}/${imageId}`;
  await storage.uploadImageAsync(imageByteArray, filename);
  await database.createDrawEventAsync(receiverId, imageId);
};

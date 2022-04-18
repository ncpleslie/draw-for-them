import { app } from "./admin";
import Storage from "../domain/storage";
const storage = new Storage(app);

export const uploadImageAsync = async (imageData: string): Promise<void> => {
  const imageAsBase64 = imageData.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(imageAsBase64, "base64");
  const imageByteArray = new Uint8Array(imageBuffer);
  await storage.uploadImageAsync(imageByteArray);
};

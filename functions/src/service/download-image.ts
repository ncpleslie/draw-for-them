import Database from "../domain/database";
import Storage from "../domain/storage";
import { app } from "./admin";
const storage = new Storage(app);
const database = new Database();

export const getImageByNameAsync = async (name: string): Promise<Buffer> => {
  const drawEvent = await database.getDrawEventAsync("user_1", name);

  if (!drawEvent.active) {
    throw new Error(`Draw event of id: ${name} is not active`);
  }

  return await storage.getImageByNameAsync(drawEvent.imageId);
};

import Storage from "../domain/storage";
import { app } from "./admin";
const storage = new Storage(app);

export const getImageByNameAsync = async (name: string): Promise<Buffer> => {
  return await storage.getImageByNameAsync(name);
};

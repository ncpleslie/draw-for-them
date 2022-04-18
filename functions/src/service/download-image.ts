import Storage from "../domain/storage";
import { app } from "./admin";
const storage = new Storage(app);

export const getImageByNameAsync = async (name: string): Promise<Buffer> => {
  return await storage.getImageByNameAsync(name);
  // return imageToHex(imageData);
};

/**
 * The following is pretty much doing this:
 * xxd -i test.jpg | sed "1s/.*\//" | sed "s/ [a-zA-Z_]*l//"
 * But since Firebase functions don't support the xxd command,
 * we are doing it manually to create a "c-like" hex string.
 * @param imageBuffer The image buffer.
 * @returns A string representing a "C-type" hex value of an image.
 */
// const imageToHex = (imageBuffer: Buffer): string => {
//   const imageHexString = imageBuffer.toString("hex");

//   // Convert hex values to a "C-type" hex value. Similar to "xxd -i".
//   // E.g. "ab1f0edc" becomes "0xab, 0x1f, 0x0e, 0xdc".
//   // Hex values are grouped by twelves.
//   let cTypeHex = "\n";
//   let groupCount = 0;
//   for (let i = 0; i < imageHexString.length; i += 2) {
//     cTypeHex += `0x${imageHexString[i]}${imageHexString[i + 1]}, `;
//     groupCount++;
//     if (groupCount % 12 === 0) {
//       cTypeHex += "\n";
//     }
//   }

//   return cTypeHex.slice(0, -2).replace(/ /gi, "").toString();
// };

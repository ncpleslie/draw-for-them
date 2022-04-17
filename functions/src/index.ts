import * as functions from "firebase-functions";
import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import cors from "cors";
import { v4 as uuid } from "uuid";
import sharp from "sharp";
// import { promises as fs } from "fs";
// import path from "path";
import serviceAccount from "./draw-for-them-firebase-adminsdk.json";
import { HTTPMethod } from "./enums/http.enum";

const corsHandler = cors({ origin: true });
const app = initializeApp({
  projectId: serviceAccount.project_id,
  credential: cert(serviceAccount as ServiceAccount),
  storageBucket: "draw-for-them.appspot.com",
});

export const upload_image = functions.https.onRequest(
  async (request: functions.Request, response: functions.Response) => {
    corsHandler(request, response, async () => {
      try {
        await postImage(request?.body?.imageData);
        response.status(200).send("Success");
      } catch (e) {
        functions.logger.error("Unable to upload image", e);
        response
          .status(500)
          .send({ message: "Internal server error", error: e });
      }
    });

    return;
  }
);

export const download_image = functions.https.onRequest(
  async (request: functions.Request, response: functions.Response) => {
    if (request.method !== HTTPMethod.GET) {
      response
        .status(404)
        .send({ message: `${request.method} is not supported` });

      return;
    }

    try {
      const image = await getImage();
      response.status(200).send(image);
    } catch (e) {
      functions.logger.error("Unable to convert file", e);
      response.status(500).send({ message: "Internal server error", error: e });
    }
  }
);

const postImage = async (imageData: string): Promise<void> => {
  const imageBuffer = Buffer.from(
    imageData.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const convertedImageBuffer = await sharp(imageBuffer)
    .jpeg({
      progressive: false,
    })
    .toBuffer();

  const imageByteArray = new Uint8Array(convertedImageBuffer);

  const bucket = getStorage(app).bucket();
  const fileUuid = uuid();
  const file = bucket.file(`images/${fileUuid}.jpeg`);
  const options = {
    resumable: false,
    contentType: "image/jpeg",
    metadata: {
      metadata: {
        contentType: "image/jpeg",
        firebaseStorageDownloadTokens: fileUuid,
      },
    },
  };

  // @ts-ignore
  file.save(imageByteArray, options);
};

const getImage = async (): Promise<string> => {
  functions.logger.log("Get image requested");
  const imageData = await loadImage("test.jpg");
  return imageToHex(imageData);
};

const loadImage = async (imageName: string): Promise<Buffer> => {
  // return fs.readFile(path.join(__dirname, "./test_images/test.jpg"));
  const bucket = getStorage(app).bucket();
  const file = bucket.file(`images/ad369a4f-7159-4105-bbc3-3940d53ff231.jpeg`);
  const fileBuffer = await file.download();

  return fileBuffer[0];
};

/**
 * The following is pretty much doing this:
 * xxd -i test.jpg | sed "1s/.*\//" | sed "s/ [a-zA-Z_]*l//"
 * But since Firebase functions don't support the xxd command,
 * we are doing it manually to create a "c-like" hex string.
 * @param imageBuffer The image buffer.
 * @returns A string representing a "C-type" hex value of an image.
 */
const imageToHex = (imageBuffer: Buffer): string => {
  const imageHexString = imageBuffer.toString("hex");

  // Convert hex values to a "C-type" hex value. Similar to "xxd -i".
  // E.g. "ab1f0edc" becomes "0xab, 0x1f, 0x0e, 0xdc".
  // Hex values are grouped by twelves.
  let cTypeHex = "\n";
  let groupCount = 0;
  for (let i = 0; i < imageHexString.length; i += 2) {
    cTypeHex += `0x${imageHexString[i]}${imageHexString[i + 1]}, `;
    groupCount++;
    if (groupCount % 12 === 0) {
      cTypeHex += "\n";
    }
  }

  return cTypeHex.slice(0, -2).replace(/ /gi, "").toString();
};
